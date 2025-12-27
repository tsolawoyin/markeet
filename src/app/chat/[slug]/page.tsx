import ChatInterface from "./chat-interface";
// but this needs to remain a server component
export default async function ChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const roomID = (await params).slug; 

  return (
    // it's only the room id we need actually. 
    // smiles.
    // thank you.
    <ChatInterface roomName={roomID} />
  );
}

// but I can definitely take it from here...
