// components/organic/CampaignModals.jsx

// Loading Dots Component
const LoadingDots = () => (
  <div className="flex items-center justify-center gap-1 mt-4">
    <div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

// Modal Wrapper
const ModalWrapper = ({ isOpen, onClose, children, showClose = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[500px] p-8 mx-4 shadow-xl">
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

// LinkedIn Not Connected Modal
const LinkedInNotConnectedModal = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} showClose={false}>
    <div className="text-center">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">
        Your Linkedin account is not connected.
      </h2>
      <p className="text-gray-500 mb-8">
        Please connect your LinkedIn account first to start a campaign.
      </p>

      <button
        onClick={onClose}
        className="w-full bg-[#3C49F7] text-white py-4 rounded-full text-base font-medium hover:bg-[#2a35d4] transition-colors"
      >
        Close
      </button>
    </div>
  </ModalWrapper>
);

// Campaign In Progress Modal
const CampaignInProgressModal = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} showClose={false}>
    <div className="text-center">
      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">
        Campaign is in progress.
      </h2>
      <p className="text-gray-500 mb-8">
        Once campaign ends, then you can view the results.
      </p>
      <button
        onClick={onClose}
        className="w-full bg-[#3C49F7] text-white py-4 rounded-full text-base font-medium hover:bg-[#2a35d4] transition-colors"
      >
        Close
      </button>
    </div>
  </ModalWrapper>
);

// Cannot Run Another Campaign Modal
const CannotRunCampaignModal = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} showClose={false}>
    <div className="text-center">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">
        You cannot run another campaign.
      </h2>
      <p className="text-gray-500 mb-2">Only one campaign can run at a time.</p>
      <p className="text-gray-500 mb-8">Please wait until the current campaign is ended</p>

      <button
        onClick={onClose}
        className="w-full bg-[#3C49F7] text-white py-4 rounded-full text-base font-medium hover:bg-[#2a35d4] transition-colors"
      >
        Close
      </button>
    </div>
  </ModalWrapper>
);

// Delete Campaign Confirmation Modal
const DeleteCampaignModal = ({ isOpen, onClose, onConfirm }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} showClose={false}>
    <div className="text-center">
      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">
        Do you want to Delete the campaign?
      </h2>
      <p className="text-gray-500 mb-8">You cannot recover your campaign. Are you sure</p>

      <div className="flex gap-4">
        <button
          onClick={onConfirm}
          className="flex-1 border-2 border-[#1a1a1a] text-[#1a1a1a] py-3 rounded-full text-base font-medium hover:bg-gray-50 transition-colors"
        >
          Yes, Delete Campaign
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-[#3C49F7] text-white py-3 rounded-full text-base font-medium hover:bg-[#2a35d4] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </ModalWrapper>
);

// Deleting Campaign Loading Modal
const DeletingCampaignModal = ({ isOpen }) => (
  <ModalWrapper isOpen={isOpen} onClose={() => {}} showClose={true}>
    <div>
      <h2 className="text-[22px] font-medium text-[#1a1a1a] mb-1 font-['DM_Sans']">
        We are deleting your campaign
      </h2>
      <p className="text-gray-500">It will take a few seconds.</p>
      <LoadingDots />
    </div>
  </ModalWrapper>
);

// Resuming Campaign Loading Modal
const ResumingCampaignModal = ({ isOpen }) => (
  <ModalWrapper isOpen={isOpen} onClose={() => {}} showClose={true}>
    <div>
      <h2 className="text-[22px] font-medium text-[#1a1a1a] mb-1 font-['DM_Sans']">
        Continue running your campaign
      </h2>
      <p className="text-gray-500">Do not close the window, we are loading your campaign</p>
      <LoadingDots />
    </div>
  </ModalWrapper>
);

// Main Component that exports all modals
const CampaignModals = ({
  showLinkedInNotConnected,
  setShowLinkedInNotConnected,
  showCampaignInProgress,
  setShowCampaignInProgress,
  showCannotRunModal,
  setShowCannotRunModal,
  showDeleteConfirm,
  setShowDeleteConfirm,
  showDeletingModal,
  showResumingModal,
  onConfirmDelete,
  selectedCampaign,
}) => {
  return (
    <>
      <LinkedInNotConnectedModal
        isOpen={showLinkedInNotConnected}
        onClose={() => setShowLinkedInNotConnected(false)}
      />

      <CampaignInProgressModal
        isOpen={showCampaignInProgress}
        onClose={() => setShowCampaignInProgress(false)}
      />

      <CannotRunCampaignModal
        isOpen={showCannotRunModal}
        onClose={() => setShowCannotRunModal(false)}
      />

      <DeleteCampaignModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onConfirmDelete}
      />

      <DeletingCampaignModal isOpen={showDeletingModal} />

      <ResumingCampaignModal isOpen={showResumingModal} />
    </>
  );
};

export default CampaignModals;