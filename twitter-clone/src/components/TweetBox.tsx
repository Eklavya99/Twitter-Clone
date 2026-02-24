'use client';

import { useState } from 'react';
import Image from 'next/image';
import { on } from 'events';

interface TweetBoxProps {
    user: {
        profilePicture: string;
        name: string;
        username: string;
    };
    onTweetPost?: (text: string) => Promise<void> | void;
}

export default function TweetBox({ user, onTweetPost }: TweetBoxProps) {
    const [text, setText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const onTweetSubmit = async () => {
        if (!text.trim()) return;
        setIsPosting(true);

        try {
            await onTweetPost?.(text.trim());
            setText('');
        }
        finally {
            setIsPosting(false);
        }
    }

    return (
    <div className="border-b dark:border-gray-700 px-4 py-3">
      <div className="flex items-start gap-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image
            src={user.profilePicture || "/default-user-profile-picture.png"}
            alt="User profile picture"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        </div>

        {/* Text Input */}
        <div className="flex-1">
          <textarea
            placeholder="What is happening?"
            className="w-full bg-transparent text-gray-900 dark:text-black text-lg resize-none outline-none placeholder-gray-500 min-h-[60px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Post Button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={onTweetSubmit}
              disabled={!text.trim() || isPosting}
              className={`rounded-full px-5 py-2 font-semibold transition-all ${
                text.trim() && !isPosting
                  ? "bg-sky-500 hover:bg-sky-600 text-white"
                  : "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}