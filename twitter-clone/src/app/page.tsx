'use client';

import TweetBox from "@/components/TweetBox";

export default function Home() {
  const loggedInUser = {
    profilePicture: "/default-user-profile-picture.png",
    name: "John Doe",
    username: "johndoe",
  }

  return (
    <div className="w-[931px] mx-auto border-x border-gray-300 dark:border-gray-700 min-h-screen">
      <TweetBox user={loggedInUser} onTweetPost={(text) => console.log(text)} />
      <div className="text-center text-gray-500 py-10">Nothing to show!</div>
    </div>
  );
}
