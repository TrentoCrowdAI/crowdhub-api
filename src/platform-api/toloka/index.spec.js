jest.mock('node-fetch');
const fetch = require('node-fetch');
const { getPoolResponses } = require('../toloka');

const mockedResponse = {
  items: [
    {
      id: '0000039334--5db1bde47e170d00de869df4',
      task_suite_id: '0000039334--5db1bde47e170d00de869df2',
      pool_id: '234292',
      user_id: 'a3c711acad79f09a2f7672cb6b66a338',
      status: 'ACCEPTED',
      reward: 0.03,
      tasks: [
        {
          id: '0000039334--5db1bcacc0696e00e38cdc24',
          input_values: {
            Title:
              'Using narrative with avatars and robots to enhance elder care',
            Abstract:
              'Elderly care is of increasing global concern. The aging population is expected to increase two-fold by 2050. It is anticipated that there will not be enough caregivers to assist the elderly very soon, and thus, researchers are looking at various technologies and potential applications that will help alleviate the problem of elderly care. This chapter examines one such assistive technology: conversational agents in the form of avatars or robots as an aid to decrease loneliness and depression among the elderly and increase the cognitive function and quality of life. The authors discuss the state-of-the-science of research prototypes and commercial off-the-shelf systems. They propose a novel concept and design, and the authors discuss the ethical ramifications of senior citizens possibly bonding with inanimate objects as if they were human companions. © 2017, IGI Global.'
          },
          pool_id: '234292',
          overlap: 1,
          infinite_overlap: false,
          reserved_for: [],
          unavailable_for: [],
          created: '2019-10-24T15:01:00.078',
          remaining_overlap: 0
        },
        {
          id: '0000039334--5db1bcacc0696e00e38cdc2a',
          input_values: {
            Title:
              'Design considerations for technology interventions to support social and physical wellness for older adults with disability',
            Abstract:
              "Social and physical wellness are important considerations for maintaining one's health into older age and remaining independent. However, some segments of the older adult population, such as those aging with disability, are at increased risk for loneliness and reduced physical activity, which could result in negative health consequences. There is a critical need to understand how to deploy social and physical wellness interventions for people aging with disability. We provide an overview of constructs related to social and physical wellness, as well as evidence-based interventions effective with older populations. Our review yields considerations for how interventions may need to be developed or modified to be efficacious for this population segment. Technology may be a key component in adopting interventions, particularly tele-technologies, which we define and discuss in depth. © 2015 International Journal of Automation and Smart Technology."
          },
          pool_id: '234292',
          overlap: 1,
          infinite_overlap: false,
          reserved_for: [],
          unavailable_for: [],
          created: '2019-10-24T15:01:00.170',
          remaining_overlap: 0
        },
        {
          id: '0000039334--5db1bcacc0696e00e38cdc2c',
          input_values: {
            Title:
              'Activating and Guiding the Engagement of Seniors With Online Social Networking: Experimental Findings From the AGES 2.0 Project',
            Abstract:
              'Objective: Guided by theoretical and empirical work attesting to the health benefits of social connections, we tested whether Internet connectivity, and training in its use for social purposes, can support the well-being of older adults receiving care. Method: Participants (N = 76) were randomly assigned to receive 3 months training versus care-as-usual. Cognitive and mental health were assessed before and after the intervention. Results: Results show significant cognitive improvements across time in the training, but not control, group. This effect was mediated through a combination of increased social activity, improved self-competence, and maintained personal identity strength. Indirect effects on mental health outcomes via these processes were also observed. Discussion: These findings suggest that Internet access and training can support the self and social connectedness of vulnerable older adults and contribute positively to well-being. © 2016, © The Author(s) 2016.'
          },
          known_solutions: [
            {
              output_values: {
                in_out_radio: 'yes'
              },
              correctness_weight: 1.0
            }
          ],
          pool_id: '234292',
          overlap: 1,
          infinite_overlap: false,
          reserved_for: [],
          unavailable_for: [],
          created: '2019-10-24T15:01:00.198',
          remaining_overlap: 0
        }
      ],
      solutions: [
        {
          output_values: {
            in_out_radio: 'yes'
          }
        },
        {
          output_values: {
            in_out_radio: 'yes'
          }
        },
        {
          output_values: {
            in_out_radio: 'yes'
          }
        }
      ],
      mixed: true,
      automerged: false,
      created: '2019-10-24T15:06:12.775',
      submitted: '2019-10-24T15:10:27.474',
      accepted: '2019-10-24T15:10:27.474',
      owner: {
        id: '25c37b14a278e96d536f75c02391469d',
        myself: true
      }
    },
    {
      id: '0000039334--5db1bee6c0696e00e38cde5e',
      task_suite_id: '0000039334--5db1bee6c0696e00e38cde5c',
      pool_id: '234292',
      user_id: 'a3c711acad79f09a2f7672cb6b66a338',
      status: 'ACCEPTED',
      reward: 0.03,
      tasks: [
        {
          id: '0000039334--5db1bcacc0696e00e38cdc2e',
          input_values: {
            Title:
              'A traceable threshold attribute-based signcryption for mHealthcare social network',
            Abstract:
              "With the rapid development of wireless sensor technologies, mobile healthcare social network (MHSN) built upon wireless body sensor network (WBSN), has evolved into an innovative next-generation healthcare system in our aging society. Nevertheless, it is vital to focus on the security issues and the tradeoff between privacy preserving and traceability. A novel security mechanism named as the traceable threshold attribute-based signcryption (TTABSC) can permits patients to be friends and make a proper tradeoff between privacy and traceability. The proposed scheme leverages a four-party model to prevent the leak of a patient's sensitive information, including symptom information, identity and patient's health information (PHI). Combining the digital signatures and encryption, we provide a series of performance analysis, including correctness, unforgeability, traceability and privacy. Compared with previous works, our most efficient scheme generates a constant signcryption size. © Copyright 2018 Inderscience Enterprises Ltd."
          },
          known_solutions: [
            {
              output_values: {
                in_out_radio: 'no'
              },
              correctness_weight: 1.0
            }
          ],
          pool_id: '234292',
          overlap: 1,
          infinite_overlap: false,
          reserved_for: [],
          unavailable_for: [],
          created: '2019-10-24T15:01:00.226',
          remaining_overlap: 0
        },
        {
          id: '0000039334--5db1bcacc0696e00e38cdc28',
          input_values: {
            Title:
              'Facebook and the elderly: The benefits of social media adoption for aged care facility residents',
            Abstract:
              "We explore the emotional effects of implementing Facebook in an aged care facility and evaluate whether computers and Facebook are of any benefit in regard to an elderly person's feeling of social connectedness. This preliminary qualitative study took place in a Melbourne-based elected Aged Care Facility. Facebook was accessed through desktop computers provided by the Facility. During a four month pilot project, six residents were supervised to learn how to competently Facebook. Findings indicate that older people are able to connect and learn the use of new technologies with which they may be unfamiliar. While high levels of user enjoyment were found, measures of social connectedness resulting from the use of Facebook use were inconclusive. The research con-cludes that when supported with appropriate teaching and technology, the use of computers to access Facebook is a practical approach in supporting the con-nectedness needs of the residents. © Springer International Publishing AG 2017."
          },
          pool_id: '234292',
          overlap: 1,
          infinite_overlap: false,
          reserved_for: [],
          unavailable_for: [],
          created: '2019-10-24T15:01:00.142',
          remaining_overlap: 0
        },
        {
          id: '0000039334--5db1bcacc0696e00e38cdc26',
          input_values: {
            Title:
              'Customized web-based system for elderly people using elements of artificial intelligence',
            Abstract:
              'Making life easier for the elderly represents a new challenge for the ICT sector. This paper presents a new web-based system designed and implemented with the aim to support the social inclusion and to improve the daily routine of the elderly people within basic information and communication features. The system provides some advanced functionalities to utilise the information value of the data collected within the presented system, e.g. The recommendations based on similar hobbies or health problems; a simple medical diagnostics; a creation of a knowledge base containing experiences and best practices, etc. We designed the system in accordance with local conditions in Slovakia, so its full functioning relies on the progress in e-Health legislation. Presented version is a preliminary result that will be further improved and tested within a real practice. © 2016 Polish Information Processing Society.'
          },
          pool_id: '234292',
          overlap: 1,
          infinite_overlap: false,
          reserved_for: [],
          unavailable_for: [],
          created: '2019-10-24T15:01:00.114',
          remaining_overlap: 0
        }
      ],
      solutions: [
        {
          output_values: {
            in_out_radio: 'no'
          }
        },
        {
          output_values: {
            in_out_radio: 'no'
          }
        },
        {
          output_values: {
            in_out_radio: 'yes'
          }
        }
      ],
      mixed: true,
      automerged: false,
      created: '2019-10-24T15:10:30.226',
      submitted: '2019-10-24T15:10:36.625',
      accepted: '2019-10-24T15:10:36.625',
      owner: {
        id: '25c37b14a278e96d536f75c02391469d',
        myself: true
      }
    }
  ],
  has_more: false
};

fetch.mockImplementation(() => {
  return Promise.resolve({
    status: 200,
    json() {
      return Promise.resolve(mockedResponse);
    }
  });
});

test('getPoolResponses should return a correctly-structured JSON', async () => {
  let results = await getPoolResponses({ id: 234292 }, {});
  expect(results).toBeDefined();
  expect(results.length).toBe(6);
});
