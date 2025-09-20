
type CommentsDisplayProps = {
    isOpen: boolean
    comment: string
    author: string
    cancelText?: string
    onCancel: () => void
    isLoading?: boolean
}

export function CommentsDisplay({
    isOpen,
    comment,
    author,
    onCancel,
    cancelText = 'Cancel',
    isLoading = false


}: CommentsDisplayProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment: </h3>
                <p className="text-gray-600 mb-6">{comment}</p>
                <p className="text-gray-600 mb-6">Made by: {author}</p>
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {cancelText}
                </button>
            </div>
        </div>
    )

}