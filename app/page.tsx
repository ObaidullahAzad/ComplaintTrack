import AOSInitializer from "@/components/AOSInitializer";
import { GoIssueClosed } from "react-icons/go";
import RegisterBtn from "@/components/RegisterBtn";
import { FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div data-aos="fade-up" className="sm:flex justify-around m-12 ">
      <AOSInitializer />
      <div className="flex mt-7 flex-col sm:mx-8 space-y-4 sm:space-y-0">
        <div className="bg-red-400 sm:m-4 p-3 rounded-3xl items-center justify-center flex shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <h1 className="sm:text-xl text-lg font-medium text-white flex items-center gap-2">
            We are here for all of your needs
            <GoIssueClosed />
          </h1>
        </div>
        <div className="sm:flex   ">
          <div className="bg-blue-300  sm:m-5 font-semibold flex items-center sm:w-80 text-white rounded-3xl shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]">
            <h2 className="text-2xl p-5">
              Submit your complaints in and track resolutions seamlessly.
              Together, we build better experiences.
            </h2>
          </div>
          <div className="bg-slate-100  font-semibold text-xl items-center sm:m-5  rounded-lg shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]">
            <h3 className="p-4">
              File complaints across multiple domains including
            </h3>
            <ul className="m-4 space-y-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle />
                Customer service issues.
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle />
                Product quality problems..
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle />
                Service delivery delays..
              </li>
            </ul>
          </div>
        </div>

        <div className="items-center justify-center flex">
          <RegisterBtn />
        </div>
      </div>
      <div className="border-2 border-gray-300 rounded-3xl p-5">
        <img
          src="/Complaint Website asset 1.jpg"
          alt="Complaint Illustration"
        />
      </div>
    </div>
  );
}
