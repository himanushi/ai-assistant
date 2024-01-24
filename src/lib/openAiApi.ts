import { token } from "~/store/token";
import { functionCaller } from "~/tools/functionCaller";
import { todoSchemas } from "~/tools/todoTool";

export const models = async () => {
  fetch("https://api.openai.com/v1/models", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
  });
};

export const compilation = async (text: string) => {
  const body = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "set_timer",
          description: "タイマーをセットします",
        },
      },
      ...todoSchemas(),
    ],
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message;

    const tool_calls = message.tool_calls;
    if (tool_calls) {
      const tool = tool_calls.find((t: any) => t);
      if (tool) {
        const name = tool.function.name;
        const args = JSON.parse(tool.function.arguments);
        return functionCaller(name, args);
      }
    }

    return message.content;
  } catch (_error) {
    return "文章生成時にエラーが発生しました";
  }
};

export const speechToText = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model", "whisper-1");

  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error sending audio to OpenAI:", error);
  }
};

export const textToSpeech = async (text: string) => {
  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: "alloy",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error generating speech from text:", error);
  }
};
