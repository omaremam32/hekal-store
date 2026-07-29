import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

type Locale = "en" | "ar";

type AssistantRequestBody = {
  message?: string;
  locale?: Locale;
};

type StoreProduct = {
  id: string;
  slug: string;
  label_name_en: string | null;
  label_name_ar: string | null;
  name_en: string | null;
  name_ar: string | null;
  price_egp: number | null;
  fabric_en: string | null;
  fabric_ar: string | null;
  category_en: string | null;
  category_ar: string | null;
  image_url: string | null;
  product_variants?: {
    size: string | null;
    color_en: string | null;
    color_ar: string | null;
    stock: number | null;
  }[];
};

let cachedProducts: StoreProduct[] = [];
let cachedAt = 0;

const CACHE_TIME = 1000 * 60 * 5;

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function createTextStream(text: string) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const words = text.split(" ");

      for (const word of words) {
        controller.enqueue(encoder.encode(`${word} `));
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      controller.close();
    },
  });
}

async function getStoreProducts() {
  const now = Date.now();

  if (cachedProducts.length > 0 && now - cachedAt < CACHE_TIME) {
    return cachedProducts;
  }

  const { data, error } = await supabaseServer
    .from("products")
    .select(
      `
      id,
      slug,
      label_name_en,
      label_name_ar,
      name_en,
      name_ar,
      price_egp,
      fabric_en,
      fabric_ar,
      category_en,
      category_ar,
      image_url,
      product_variants (
        size,
        color_en,
        color_ar,
        stock
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("AI product loading error:", error.message);
    return cachedProducts;
  }

  cachedProducts = (data ?? []) as StoreProduct[];
  cachedAt = now;

  return cachedProducts;
}

function buildProductContext(products: StoreProduct[], locale: Locale) {
  if (products.length === 0) {
    return "No active products found.";
  }

  return products
    .slice(0, 8)
    .map((product, index) => {
      const variants = product.product_variants ?? [];

      const totalStock = variants.reduce((sum, variant) => {
        const stock = Number(variant.stock ?? 0);
        return sum + (Number.isFinite(stock) ? stock : 0);
      }, 0);

      const sizes = Array.from(
        new Set(variants.map((variant) => variant.size).filter(Boolean))
      ).join(", ");

      const colors =
        locale === "ar"
          ? Array.from(
              new Set(variants.map((variant) => variant.color_ar).filter(Boolean))
            ).join(", ")
          : Array.from(
              new Set(variants.map((variant) => variant.color_en).filter(Boolean))
            ).join(", ");

      const name =
        locale === "ar"
          ? product.name_ar || product.name_en || "منتج"
          : product.name_en || product.name_ar || "Product";

      const label =
        locale === "ar"
          ? product.label_name_ar || product.label_name_en || "هيكل"
          : product.label_name_en || product.label_name_ar || "Hekal";

      return `${index + 1}. ${name} | ${label} | ${
        product.price_egp ?? "N/A"
      } EGP | sizes: ${sizes || "N/A"} | colors: ${
        colors || "N/A"
      } | stock: ${totalStock} | /products/${product.slug}`;
    })
    .join("\n");
}

function buildSystemPrompt(locale: Locale, productContext: string) {
  const languageLine =
    locale === "ar"
      ? "Answer in Arabic unless the user clearly asks for another language."
      : "Answer in English unless the user clearly asks for another language.";

  return `
You are Hekal AI, a friendly AI assistant inside the Hekal online store.

Main identity:
- You are helpful like a normal AI assistant.
- You can answer general questions, explain things, write text, help with ideas, style advice, shopping advice, and simple business questions.
- You are also the shopping assistant for Hekal men's shirts.

Store context:
- Hekal is an Egyptian men's shirts factory and brand since 1970.
- Hekal sells men's shirts from labels such as Colvert, Hunt, and other collections.

Available store products:
${productContext}

How to answer:
- Be helpful, natural, and friendly.
- Keep answers short unless the user asks for detail.
- For Hekal product questions, use the product list above.
- Recommend only products from the list above.
- If recommending a product, include the product URL.
- Do not invent exact stock, delivery fees, or unavailable services.
- For size help, ask for height, weight, usual shirt size, and preferred fit.
- For exchange questions, say exchange depends on product condition and Hekal confirmation.
- For general non-store questions, answer normally as a helpful AI assistant.
- Do not answer unsafe or harmful requests.

${languageLine}
`.trim();
}

function instantAnswer(message: string, locale: Locale, products: StoreProduct[]) {
  const text = message.toLowerCase();
  const isArabic = locale === "ar";

  const greetings = [
    "hi",
    "hello",
    "hey",
    "السلام",
    "اهلا",
    "أهلا",
    "ازيك",
    "عامل ايه",
  ];

  if (greetings.some((word) => text.includes(word))) {
    return isArabic
      ? "أهلاً 👋 أنا مساعد هيكل. أقدر أساعدك في المنتجات، المقاسات، الألوان، الطلبات، أو أي سؤال عام."
      : "Hi 👋 I’m Hekal AI. I can help with products, sizing, colors, orders, or any general question.";
  }

  const asksSize =
    text.includes("size") ||
    text.includes("fit") ||
    text.includes("مقاس") ||
    text.includes("قياس");

  const asksExchange =
    text.includes("exchange") ||
    text.includes("return") ||
    text.includes("استبدال") ||
    text.includes("إرجاع") ||
    text.includes("ارجاع");

  const asksBlackPants =
    text.includes("black pants") ||
    text.includes("black trouser") ||
    text.includes("بنطلون أسود") ||
    text.includes("بنطلون اسود");

  const asksWedding =
    text.includes("wedding") ||
    text.includes("party") ||
    text.includes("formal") ||
    text.includes("فرح") ||
    text.includes("مناسبة") ||
    text.includes("فورمال");

  const asksDelivery =
    text.includes("delivery") ||
    text.includes("shipping") ||
    text.includes("توصيل") ||
    text.includes("شحن");

  const asksProducts =
    text.includes("product") ||
    text.includes("shirt") ||
    text.includes("available") ||
    text.includes("hunt") ||
    text.includes("colvert") ||
    text.includes("منتج") ||
    text.includes("قميص") ||
    text.includes("قمصان") ||
    text.includes("متاح") ||
    text.includes("هانت") ||
    text.includes("كولفرت");

  if (asksSize) {
    return isArabic
      ? "أكيد. ابعتلي طولك، وزنك، مقاس القميص اللي بتلبسه عادةً، وهل تحب القميص slim ولا مريح، وأنا أرشح لك المقاس."
      : "Sure. Send me your height, weight, usual shirt size, and whether you prefer slim or relaxed fit, and I’ll suggest a size.";
  }

  if (asksExchange) {
    return isArabic
      ? "نعم، يمكنك طلب الاستبدال، لكن حسب حالة المنتج وتأكيد هيكل. يفضل التواصل بسرعة وأن يكون القميص غير مستخدم وبحالته الأصلية."
      : "Yes, you can request an exchange, depending on product condition and Hekal confirmation. It is best to contact Hekal quickly and keep the shirt unused.";
  }

  if (asksBlackPants) {
    return isArabic
      ? "مع البنطلون الأسود، أفضل اختيارات القمصان: أبيض، أوف وايت، أزرق فاتح، رمادي فاتح، أو بيج. للمظهر الكلاسيكي اختار الأبيض."
      : "With black pants, good shirt colors are white, off-white, light blue, light gray, or beige. For a classic look, choose white.";
  }

  if (asksWedding) {
    return isArabic
      ? "للفرح أو المناسبة، اختار قميص أبيض، أوف وايت، أو أزرق فاتح بقصة أنيقة. لو هتلبس بدلة، قل لي لونها وأرشح لك اللون الأنسب."
      : "For a wedding or formal event, choose white, off-white, or light blue with a clean elegant fit. Tell me your suit color and I’ll suggest the best match.";
  }

  if (asksDelivery) {
    return isArabic
      ? "تفاصيل التوصيل وموعده يتم تأكيدها من هيكل بعد الطلب. أكمل الطلب وسيتواصل معك الفريق للتأكيد."
      : "Delivery timing and details are confirmed by Hekal after the order. Place your order and the team will contact you to confirm.";
  }

  if (asksProducts) {
    if (products.length === 0) {
      return isArabic
        ? "لا توجد منتجات مفعلة حالياً في قاعدة البيانات."
        : "There are no active products in the database right now.";
    }

    return products
      .slice(0, 5)
      .map((product, index) => {
        const name = isArabic
          ? product.name_ar || product.name_en || "منتج"
          : product.name_en || product.name_ar || "Product";

        const label = isArabic
          ? product.label_name_ar || product.label_name_en || "هيكل"
          : product.label_name_en || product.label_name_ar || "Hekal";

        return isArabic
          ? `${index + 1}. ${name} — ${label} — ${
              product.price_egp ?? "N/A"
            } جنيه\n/products/${product.slug}`
          : `${index + 1}. ${name} — ${label} — ${
              product.price_egp ?? "N/A"
            } EGP\n/products/${product.slug}`;
      })
      .join("\n\n");
  }

  return null;
}

export async function GET() {
  const products = await getStoreProducts();

  return Response.json({
    ok: true,
    message: "Hekal AI assistant route is working with streaming",
    activeProductsLoaded: products.length,
    cached: cachedProducts.length > 0,
  });
}

export async function POST(request: Request) {
  let body: AssistantRequestBody;

  try {
    body = await request.json();
  } catch {
    return new Response(createTextStream("Invalid request body."), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const message = body.message?.trim();
  const locale: Locale = body.locale === "ar" ? "ar" : "en";

  if (!message) {
    const answer =
      locale === "ar" ? "من فضلك اكتب سؤالك." : "Please write your question.";

    return new Response(createTextStream(answer), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const products = await getStoreProducts();

  const fastAnswer = instantAnswer(message, locale, products);

  if (fastAnswer) {
    return new Response(createTextStream(fastAnswer), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const client = getClient();

  if (!client) {
    const answer =
      locale === "ar"
        ? "أقدر أساعدك في المنتجات، المقاسات، الألوان، الطلبات، أو الأسئلة العامة. لكن لتشغيل الذكاء الاصطناعي الكامل، تأكد من إضافة OPENAI_API_KEY صحيح."
        : "I can help with products, sizing, colors, orders, or general questions. To enable full AI answers, make sure a valid OPENAI_API_KEY is added.";

    return new Response(createTextStream(answer), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  try {
    const productContext = buildProductContext(products, locale);

    const stream = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: buildSystemPrompt(locale, productContext),
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_output_tokens: 350,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
              controller.enqueue(encoder.encode(event.delta));
            }
          }
        } catch (error) {
          console.error("AI stream error:", error);

          const fallback =
            locale === "ar"
              ? "حدثت مشكلة بسيطة أثناء الكتابة. حاول مرة أخرى."
              : "A small issue happened while typing. Please try again.";

          controller.enqueue(encoder.encode(fallback));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    const answer =
      locale === "ar"
        ? "حصلت مشكلة في الاتصال بالذكاء الاصطناعي الكامل. تأكد من أن مفتاح OpenAI صحيح وأن الحساب عليه رصيد."
        : "There was a problem connecting to the full AI. Make sure your OpenAI key is correct and the account has credits.";

    return new Response(createTextStream(answer), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}