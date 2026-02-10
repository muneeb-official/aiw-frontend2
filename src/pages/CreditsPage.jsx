// pages/CreditsPage.jsx
import { useState } from "react";
import {
    statsCards,
    creditCards,
    todayMeetings,
    weekMeetings,
    userData,
} from "../data/mockData";
import { footerLinks } from "../data/salesAgentData";
import logofooter from "../assets/Logo-footer.svg";
import inbox from "../assets/icons/envelope.svg";
import call from "../assets/icons/phone.svg";

// Icons
// const icons = {
//   envelope,
//   inbox,
//   percent,
//   call,
//   duration,
// };


// const Icon = ({ name }) => {
//   const src = icons[name];
//   return src ? <img src={src} alt={name} className="w-[60px] h-[60px]" /> : null;
// };
export default function CreditsPage() {
    const [activeTab, setActiveTab] = useState("enrichment"); // "enrichment" or "calling"
    const [sliderValue, setSliderValue] = useState(1200);

    // Credit status data
    const creditStatus = {
        enrichment: {
            current: 0,
            total: 1000,
            label: "credits",
            agentName: "B2C Lead Builder Agent",
        },
        calling: {
            current: 324,
            total: 1000,
            label: "min. credits",
            agentName: "Call Outbound Agent",
        },
    };

    // Slider marks
    const sliderMarks = [0, 1000, 2500, 5000];

    // Calculate price based on credits (example pricing)
    const calculatePrice = (credits) => {
        // Example: £1.08 per credit approximately
        return Math.round(credits * 1.0825);
    };

    // Get slider percentage for positioning
    const getSliderPercentage = () => {
        return (sliderValue / 5000) * 100;
    };

    // Handle slider change
    const handleSliderChange = (e) => {
        setSliderValue(Number(e.target.value));
    };

    return (
        <div className="flex flex-col h-full ">
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {/* Page Title */}
                <h1 className="text-[40px] font-bold text-gray-800 mb-6">
                    Hello {userData.name}, you can get more credits here
                </h1>

                {/* Get More Credits Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <h2 className="text-[32px] font-semibold text-gray-800 mb-1">Get More Credits</h2>
                    <p className="text-gray-900 text-[21px] font-bold mb-6">Select the Agent you want credits for</p>

                    {/* Tabs */}
                    <div className="flex gap-3 mb-8">
                        <button
                            onClick={() => setActiveTab("enrichment")}
                            className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200 ${activeTab === "enrichment"
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-900 border-2 border-gray-900 hover:border-gray-400"
                                }`}
                        >
                            Enrichment Credits
                        </button>
                        <button
                            onClick={() => setActiveTab("calling")}
                            className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 ${activeTab === "calling"
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-900 border-2 border-gray-900 hover:border-gray-400"
                                }`}
                        >
                            Calling Minutes Credits
                        </button>
                    </div>

                    {/* Credit Selector Box */}
                    <div className="bg-[#FBFBFF] border border-[#7770FF] rounded-xl p-6 mb-16">
                        <h3 className="text-[25px] font-semibold text-gray-800 mb-4">
                            {activeTab === "enrichment" ? "Enrichment Credits" : "Calling Minutes Credits"}
                        </h3>

                        {/* Slider */}
                        <div className="mb-6">
                            {/* Slider Track */}
                            <div className="relative h-2 bg-[#BED6F7] rounded-full mb-3">
                                {/* Filled Track */}
                                <div
                                    className="absolute h-full bg-[#6A6DCD] rounded-full"
                                    style={{ width: `${getSliderPercentage()}%` }}
                                />
                                {/* Slider Thumb */}
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                    className="absolute w-full h-full opacity-0 cursor-pointer"
                                />
                                {/* Custom Thumb */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#6A6DCD] border-2 border-[#6A6DCD] rounded-full shadow-md pointer-events-none"
                                    style={{ left: `calc(${getSliderPercentage()}% - 8px)` }}
                                />
                            </div>

                            {/* Slider Labels */}
                            <div className="flex justify-between text-[14px] text-gray-900">
                                {sliderMarks.map((mark) => (
                                    <span key={mark}>{mark}</span>
                                ))}
                            </div>
                        </div>

                        {/* Credits Display */}
                        <h2 className="text-[32px] font-bold text-gray-800 mb-4">
                            Get {sliderValue} {activeTab === "calling" ? "Min. Credits" : "Credits"}
                        </h2>

                        {/* Pay Button */}
                        <button className="px-6 py-2.5 text-[16px] border-2 border-[#0028B6] text-[#0028B6] rounded-full font-medium hover:bg-blue-50 transition-colors">
                            Pay £ {calculatePrice(sliderValue)}
                        </button>
                    </div>
                    {/* Current Credits Status */}
                    <div className="mb-0 ">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Your current credits status</h2>
                        <hr className="border-gray-200 mb-8" />

                        <div className="flex gap-24">
                            {/* Enrichment Credits Status */}
                            <div className="flex flex-col items-start w-[632px]">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                    <img src={inbox} className="w-[60px] h-[60px]" />
                                </div>
                                <div className="mb-1">
                                    <span className="text-[32px] font-bold text-gray-800">
                                        {creditStatus.enrichment.current}
                                    </span>
                                    <span className="text-[#787878] text-[18px] font-bold">
                                        /{creditStatus.enrichment.total} {creditStatus.enrichment.label}
                                    </span>
                                </div>
                                <p className="text-[#9F9F9F] text-[18px] font-bold">{creditStatus.enrichment.agentName}</p>
                            </div>

                            {/* Calling Credits Status */}
                            <div className="flex flex-col items-start w-[632px]">
                                <div className="w-14 h-14  rounded-xl flex items-center justify-center mb-4">
                                    <img src={call} className="w-[60px] h-[60px]" />
                                </div>
                                <div className="mb-1">
                                    <span className="text-[32px] font-bold text-gray-800">
                                        {creditStatus.calling.current}
                                    </span>
                                    <span className="text-[#787878] text-[18px] font-bold">
                                        /{creditStatus.calling.total} {creditStatus.calling.label}
                                    </span>
                                </div>
                                <p className="text-[#9F9F9F] text-[18px] font-bold">{creditStatus.calling.agentName}</p>
                            </div>
                        </div>
                    </div>

                </div>


            </div>

            {/* Footer */}
            <footer className="bg-white h-[50px] px-5 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                    <img src={logofooter} alt="Logo" className="w-5 h-5 object-contain" />
                    <span className="text-sm">© 2025 aiworkforce.co.uk</span>
                </div>
                <nav className="flex items-center gap-6">
                    {footerLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
            </footer>
        </div>
    );
}