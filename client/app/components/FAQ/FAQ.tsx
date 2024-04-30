import { styles } from '@/app/styles/style';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi';

type Props = {}

const FAQ = (props: Props) => {
    const { data } = useGetHeroDataQuery("FAQ", {
      });
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

  return (
    <div>
         <div className="w-[50%] 800px:w-[50%] m-auto">
        {/* <h1 className={``}>
          Frequently Asked Questions
        </h1> */}
         <h1 className={`${styles.title} 800px:!text-[45px]`}>
        {/* Get in */}
        <span className='text-gradient'>  Frequently Asked Questions</span>
      </h1>
        <div className="mt-5">
          <dl className="space-y-4">
            {questions?.map((q) => (
              <div key={q.id}
              className={`${
                q._id !== questions[0]?._id && "border-t"
              } border-gray-400 pt-4`}
              >
                <dt className="text-[17px] font-poppins font-[500]">
                  <button
                    className="flex items-start justify-between w-full text-left focus:outline-none"
                    onClick={() => toggleQuestion(q._id)}
                  >
                    <span className="font-medium text-black dark:text-white">{q.question}</span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === q._id ? (
                        <HiMinus className="h-6 w-6 text-black dark:text-white" />
                      ) : (
                        <HiPlus className="h-6 w-6 text-black dark:text-white" />
                      )}
                    </span>
                  </button>
                </dt>
                {activeQuestion === q._id && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base font-Poppins text-black dark:text-white">{q.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div> 
    </div>
  )
}

export default FAQ