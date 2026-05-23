import { Request, Response } from "express"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateTicketSuggestions = async (
  req: Request,
  res: Response
) => {
  try {
    const { title } = req.body

    const completion =
      await openai.chat.completions.create({
        model: "gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content:
              "You are an AI ticket assistant. Return only valid JSON with type, priority and description.",
          },
          {
            role: "user",
            content: title,
          },
        ],
      })

    const response =
      completion.choices[0].message.content

    console.log(response)

    return res
      .status(200)
      .json(JSON.parse(response || "{}"))

  } catch (error: any) {

    console.log(error)

    return res.status(200).json({
      type: "BUG",
      priority: "HIGH",
      description:
        "AI quota exceeded. Mock AI response generated.",
    })
  }
}