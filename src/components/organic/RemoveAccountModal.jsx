// components/organic/RemoveAccountModal.jsx

const RemoveAccountModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-[480px] p-8 mx-4 shadow-xl">
                <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-4 font-['DM_Sans'] leading-tight">
                    Do you want to remove your LinkedIn account?
                </h2>
                
                <p className="text-[16px] text-[#6B7280] mb-8 font-['DM_Sans']">
                    If you remove your LinkedIn account, all your campaigns will stop and you have to restart from scratch.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full text-[14px] font-medium bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors font-['DM_Sans']"
                    >
                        Close
                    </button>
                    
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-full text-[14px] font-medium border border-gray-300 text-[#1a1a1a] hover:bg-gray-50 transition-colors font-['DM_Sans']"
                    >
                        Remove account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveAccountModal;