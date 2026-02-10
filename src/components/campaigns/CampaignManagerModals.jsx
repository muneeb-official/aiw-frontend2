// components/campaigns/CampaignManagerModals.jsx

// Loading Dots Component
const LoadingDots = () => (
  <div className="flex items-center justify-center gap-1 mt-4">
    <div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

// Modal Wrapper
const ModalWrapper = ({ isOpen, onClose, children, showClose = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[500px] p-8 mx-4 shadow-xl">
        {showClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
        )}
        {children}
      </div>
    </div>
  );
};

// Info Icon
const InfoIcon = () => (
  <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-6">
    <svg className="w-8 h-8 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

// Success Icon (Verified Badge)
const SuccessIcon = () => (
  <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-6">
    <svg className="w-10 h-10 text-[#3C49F7]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm4.768 9.14a1 1 0 10-1.536-1.28l-4.3 5.159-2.225-2.226a1 1 0 00-1.414 1.414l3 3a1 1 0 001.475-.067l5-6z" clipRule="evenodd" />
    </svg>
  </div>
);

// Remove Lead Confirmation Modal
const RemoveConfirmModal = ({ isOpen, onClose, onConfirm }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose}>
    <div className="text-center">
      <InfoIcon />
      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">Are you sure?</h2>
      <p className="text-gray-500 mb-8">You want to remove from the campaign.</p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 border-2 border-[#1a1a1a] text-[#1a1a1a] py-3 rounded-full text-base font-medium hover:bg-gray-50"
        >
          Close
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-[#3C49F7] text-white py-3 rounded-full text-base font-medium hover:bg-[#2a35d4]"
        >
          Remove from Campaign
        </button>
      </div>
    </div>
  </ModalWrapper>
);

// Remove Lead Success Modal
const RemoveSuccessModal = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose}>
    <div className="text-center">
      <SuccessIcon />
      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">
        The Profile has been removed from the campaign
      </h2>
      <p className="text-gray-500 mb-8">The selected lead is now removed from the campaign.</p>
      <button
        onClick={onClose}
        className="w-full bg-[#3C49F7] text-white py-4 rounded-full text-base font-medium hover:bg-[#2a35d4]"
      >
        Close
      </button>
    </div>
  </ModalWrapper>
);

// Enrich All Confirmation Modal
const EnrichConfirmModal = ({ isOpen, onClose, onConfirm, leadCount }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose}>
    <div className="text-center">
      <InfoIcon />
      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">Are you sure?</h2>
      <p className="text-gray-500 mb-8">You want to enrich all {leadCount} leads.</p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 border-2 border-[#1a1a1a] text-[#1a1a1a] py-3 rounded-full text-base font-medium hover:bg-gray-50"
        >
          Close
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-[#3C49F7] text-white py-3 rounded-full text-base font-medium hover:bg-[#2a35d4]"
        >
          Enrich All {leadCount} Leads
        </button>
      </div>
    </div>
  </ModalWrapper>
);

// Enriching Modal (Loading)
const EnrichingModal = ({ isOpen }) => (
  <ModalWrapper isOpen={isOpen} onClose={() => {}} showClose={true}>
    <div>
      <h2 className="text-[22px] font-medium text-[#1a1a1a] mb-1 font-['DM_Sans']">
        We are enriching all your profiles
      </h2>
      <p className="text-gray-500">Please wait, It will take a few seconds.</p>
      <LoadingDots />
    </div>
  </ModalWrapper>
);

// Cannot Start Campaign Modal
const CannotStartModal = ({ isOpen, onClose, onEnrichAll, leadCount }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose}>
    <div className="text-center">
      <InfoIcon />
      <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-3 font-['DM_Sans']">
        You cannot start this campaign.
      </h2>
      <p className="text-gray-500 mb-8">
        In a campaign all the leads needs to be enriched. So ensure all the leads are enriched before starting a campaign.
      </p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 border-2 border-[#1a1a1a] text-[#1a1a1a] py-3 rounded-full text-base font-medium hover:bg-gray-50"
        >
          Close
        </button>
        <button
          onClick={onEnrichAll}
          className="flex-1 bg-[#3C49F7] text-white py-3 rounded-full text-base font-medium hover:bg-[#2a35d4]"
        >
          Enrich All {leadCount} Leads
        </button>
      </div>
    </div>
  </ModalWrapper>
);

// Main Component
const CampaignManagerModals = ({
  showRemoveConfirm,
  setShowRemoveConfirm,
  showRemoveSuccess,
  setShowRemoveSuccess,
  showEnrichConfirm,
  setShowEnrichConfirm,
  showEnrichingModal,
  showCannotStartModal,
  setShowCannotStartModal,
  onConfirmRemove,
  onConfirmEnrichAll,
  leadCount,
}) => {
  return (
    <>
      <RemoveConfirmModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={onConfirmRemove}
      />
      <RemoveSuccessModal
        isOpen={showRemoveSuccess}
        onClose={() => setShowRemoveSuccess(false)}
      />
      <EnrichConfirmModal
        isOpen={showEnrichConfirm}
        onClose={() => setShowEnrichConfirm(false)}
        onConfirm={onConfirmEnrichAll}
        leadCount={leadCount}
      />
      <EnrichingModal isOpen={showEnrichingModal} />
      <CannotStartModal
        isOpen={showCannotStartModal}
        onClose={() => setShowCannotStartModal(false)}
        onEnrichAll={() => {
          setShowCannotStartModal(false);
          onConfirmEnrichAll();
        }}
        leadCount={leadCount}
      />
    </>
  );
};

export default CampaignManagerModals;