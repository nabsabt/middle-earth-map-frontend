export interface QuizModel {
  _id: any;
  pos: number;
  lvl: 1 | 2 | 3;
  question: {
    EN: string;
    HU: string;
  };
  correctAnswerID: number;
  answers: {
    1: {
      EN: string;
      HU: string;
    };
    2: {
      EN: string;
      HU: string;
    };
    3: {
      EN: string;
      HU: string;
    };
    4: {
      EN: string;
      HU: string;
    };
  };
}

export interface ClearedQuestion {
  pos: number;
  question: string;
  options: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
  serial: number;
}

export interface QuizResults {
  percentage: number;
  responseMessage: string;
}
