import { defineField } from "sanity"

const user = {
    name: "user",
    title: "user",
    type: "document",
    fields: [
        defineField({
            name: "isAdmin",
            title: "Is Admin",
            type: "boolean",
            description: "Check if user is admin",
            validation: Rule => Rule.required(),
            // readOnly: true,
            // hidden: true,
        }),
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            description: "name of the user",
            validation: Rule => Rule.required(),
            readOnly: true,
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "url",
        }),
        defineField({
            name: "password",
            type: "string",
            hidden: true,
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "emailVerified",
            type: "datetime",
            hidden: true,
        }),
        defineField({
            name: "about",
            title: "About",
            type: "text",
            description: "A brief description about user",
        })
  ],
};




export default user;