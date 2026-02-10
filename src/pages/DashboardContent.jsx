// components/DashboardContent.jsx
import {
  statsCards,
  creditCards,
  todayMeetings,
  weekMeetings,
  userData,
} from "../data/mockData";
import backgroundImage from "../assets/Background.png"

import envelope from '../assets/icons/envelope.svg';
import inbox from '../assets/icons/inbox.svg';
import percent from '../assets/icons/percentage.svg';
import phone from '../assets/icons/phone.svg';
import duration from '../assets/icons/duration.svg';

const icons = {
  envelope,
  inbox,
  percent,
  phone,
  duration,
};


const Icon = ({ name }) => {
  const src = icons[name];
  return src ? <img src={src} alt={name} className="w-[60px] h-[60px]" /> : null;
};

const StatCard = ({ value, label, iconType }) => (
  <div className="bg-white rounded-2xl p-10 shadow-sm">
    <div className="text-amber-500">
      <Icon name={iconType} />
    </div>
    <div className="mt-3">
      <div className="text-[30px] font-bold text-gray-800">{value}</div>
      <div className="text-[18px] font-bold text-[#9F9F9F] mt-1">{label}</div>
    </div>
  </div>
);

const CreditCard = ({ title, used, total }) => (
  <div className="bg-[#FBFBFF] rounded-xl p-6 border-2 border-[#7770FF]">
    <div className="text-[32px] text-gray-800 mb-3">{title}</div>
    <div className="flex items-baseline">
      <span className="text-[64px] font-bold text-gray-800">{used}</span>
      <span className="text-gray-900 font-semibold text-[18px] ml-1">/{total}</span>
    </div>
  </div>
);

const MeetingCard = ({ meeting }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex justify-between items-start">
    <div className="flex-1">
      <h3 className="font-bold text-[24px] text-gray-800">
        {meeting.company}
        {meeting.title && ` – ${meeting.title}`}
      </h3>
      {meeting.description && (
        <p className="text-[16px] text-[#000000] mt-0.5">{meeting.description}</p>
      )}
      <p className="text-[16px] text-[#000000] mt-1">{meeting.time}</p>
    </div>
    <button className="text-blue-600 bg-white font-medium text-sm border-2 border-transparent hover:border-[#3C49F7] border-4 py-2 px-4 rounded-full whitespace-nowrap ml-4 transition-all duration-200">
      {meeting.actionType === "join" ? "Join Meeting" : "Notify Me"}
    </button>
  </div>
);

export default function DashboardContent({ setActivePage }) {
  return (
    <div
      className="px-8 py-6 h-full w-full overflow-auto bg-cover bg-center bg-no-repeat bg-fixed"
    // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-[40px] font-bold text-gray-800 mb-6">
        Hello {userData.name}, below are your insights
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-3 mb-16">
        {statsCards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {/* Credits Section */}
      <div className="bg-white backdrop-blur-sm rounded-3xl p-6 mb-16">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[32px] font-semibold text-gray-800">
              Your Credits Usage summary, So far!
            </h2>
            <p className="text-[21px] text-gray-800 font-medium mt-1">
              You have used {userData.creditsUsedPercentage}% of Credits, so
              far!
            </p>
          </div>
          <button
            onClick={() => setActivePage("credits")}
            className="text-blue-600 font-medium text-sm border border-transparent hover:border-[#3C49F7] border-4 py-2 px-4 rounded-full transition-all duration-200"
          >
            Get More Credits
          </button>
        </div>
        <div className="grid grid-cols-3 gap-10">
          {creditCards.map((card, idx) => (
            <CreditCard key={idx} {...card} />
          ))}
        </div>
      </div>

      {/* Meetings Today */}
      <div className="bg-white backdrop-blur-sm rounded-3xl p-6 mb-16">
        <div className="flex gap-32">
          <div className="w-1/2">
            <h2 className="text-[32px] text-[#000000]">
              {todayMeetings.length} Meetings Schedule Today
            </h2>
            <p className="text-[21px] font-bold text-[#000000] mt-1">
              Here is a list for this week meetings.
            </p>
          </div>
          <div className="flex-1 text-[#000000] space-y-3">
            {todayMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      </div>

      {/* Meetings This Week */}
      <div className="bg-white backdrop-blur-sm rounded-3xl p-6 mb-1">
        <div className="flex gap-32">
          <div className="w-1/2">
            <h2 className="text-[32px] text-[#000000]">
              Meetings Schedule This Week
            </h2>
            <p className="text-[21px] font-bold text-[#000000] mt-1">
              Here is a list for this week meetings.
            </p>
          </div>
          <div className="flex-1 space-y-3">
            {weekMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-[#3C49F7] text-white px-6 py-2.5 border-[#3C49F7] rounded-full text-sm font-medium">
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
}