import type { GlobalConfig } from "payload";

/** Theme & colours — controls the site's look without code. */
export const Appearance: GlobalConfig = {
  slug: "appearance",
  label: "Appearance",
  admin: { group: "Appearance" },
  access: { read: () => true },
  fields: [
    {
      name: "theme",
      type: "select",
      defaultValue: "dark",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
      ],
      admin: { description: "Default colour scheme for the website." },
    },
    {
      type: "row",
      fields: [
        {
          name: "accentColor",
          type: "text",
          defaultValue: "#25c9e2",
          admin: { description: "Main accent colour (hex), e.g. #25c9e2" },
        },
        {
          name: "accentHover",
          type: "text",
          defaultValue: "#54d9ef",
          admin: { description: "Accent hover colour (hex)." },
        },
      ],
    },
    {
      name: "backgroundColor",
      type: "text",
      admin: { description: "Optional background colour override (hex). Leave blank for the theme default." },
    },
  ],
};
