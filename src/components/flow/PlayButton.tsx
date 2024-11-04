interface PlayButtonProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}
export default function PlayButton({
  isPlaying,
  setIsPlaying,
}: PlayButtonProps) {
  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      className="flex items-center px-2.5 py-1.5 bg-sky-200 text-gray-800 rounded-md hover:bg-sky-300 transition-transform duration-300 transform hover:scale-105 shadow-sm"
    >
      {isPlaying ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 mr-1.5"
          >
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
          stop
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 mr-1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-6.012-3.606A1 1 0 007 8.388v7.224a1 1 0 001.74.808l6.012-3.606a1 1 0 000-1.664z"
            />
          </svg>
          play
        </>
      )}
    </button>
  );
}
