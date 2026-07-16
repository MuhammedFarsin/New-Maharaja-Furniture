export function seo(
  title: string,
  description: string,
  path: string
) {
  const url = `https://new-maharaja-furniture.vercel.app${path}`;

  return {
    meta: [
      {
        title,
      },
      {
        name: "description",
        content: description,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: url,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: url,
      },
    ],
  };
}