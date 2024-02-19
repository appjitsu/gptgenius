import { fetchOrGenerateTokens } from "@/utils/actions";
import { UserButton, auth, currentUser } from "@clerk/nextjs";

const MemberProfile = async () => {
  const user = await currentUser();
  const { userId } = auth();
  if (!userId) return null;
  await fetchOrGenerateTokens(userId);

  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p className="text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
};

export default MemberProfile;
