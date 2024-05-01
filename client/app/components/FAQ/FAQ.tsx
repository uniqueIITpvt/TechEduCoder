import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {
  inPage: boolean;
};

const FAQ = ({ inPage }: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout?.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };
  console.log(inPage);

  return (
    <div className={`w-[90%] mx-auto ${inPage ? "" : "grid grid-cols-2 gap-4"}`}>
      <div className="col-span-1">
        <h1 className={`${styles.title} 800px:!text-[50px]`}>
          <span className="text-gradient">FAQs</span>
        </h1>
        <div className="mt-5">
          <dl className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`${
                  q._id !== questions[0]?._id && ""
                } border-[1px] border-gray-400 p-3 rounded-md shadow-sm`}
              >
                <dt className="text-[17px] font-poppins font-[500] transition-all ease-in-out duration-200">
                  <button
                    className="flex items-start justify-between w-full text-left focus:outline-none"
                    onClick={() => toggleQuestion(q._id)}
                  >
                    <span className={`font-[600] text-black dark:text-white text-[18px]`}>
                      {q.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === q._id ? (
                        <HiMinus className="h-6 w-6 text-black dark:text-white" />
                      ) : (
                        <HiPlus className="h-6 w-6 text-black dark:text-white" />
                      )}
                    </span>
                  </button>
                </dt>
                <dd
                  className={`mt-2 pr-12 transition-all duration-900 ${
                    activeQuestion === q._id ? "max-h-[1000px]" : "max-h-0"
                  } overflow-hidden`}
                >
                  <p className="text-base font-Poppins text-black dark:text-white">
                    {q.answer}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default FAQ;
;
