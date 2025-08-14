import { Survey, SurveyResponse } from '../types';
import { authService } from './authService';

const SURVEYS_KEY = 'surveys';
const RESPONSES_KEY_PREFIX = 'responses_';

function loadSurveys(): Survey[] {
  try {
    const raw = localStorage.getItem(SURVEYS_KEY);
    return raw ? (JSON.parse(raw) as Survey[]) : [];
  } catch {
    return [];
  }
}

function saveAllSurveys(surveys: Survey[]) {
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
}

export const storageService = {
  getSurveys(): Survey[] {
    const user = authService.getCurrentUser();
    const surveys = loadSurveys();
    if (!user) return [];
    return surveys.filter(s => s.userId === user.id);
  },

  getSurvey(id: string): Survey | undefined {
    return loadSurveys().find(s => s.id === id);
  },

  saveSurvey(survey: Survey) {
    const surveys = loadSurveys();
    const idx = surveys.findIndex(s => s.id === survey.id);
    if (idx >= 0) surveys[idx] = survey; else surveys.push(survey);
    saveAllSurveys(surveys);
  },

  deleteSurvey(id: string) {
    const surveys = loadSurveys().filter(s => s.id !== id);
    saveAllSurveys(surveys);
    localStorage.removeItem(RESPONSES_KEY_PREFIX + id);
  },

  saveResponse(surveyId: string, answers: Record<string, any>) {
    const responses = storageService.getResponses(surveyId);
    const response: SurveyResponse = {
      id: `resp_${Date.now()}`,
      surveyId,
      submittedAt: Date.now(),
      answers,
    };
    responses.push(response);
    localStorage.setItem(RESPONSES_KEY_PREFIX + surveyId, JSON.stringify(responses));
  },

  getResponses(surveyId: string): SurveyResponse[] {
    try {
      const raw = localStorage.getItem(RESPONSES_KEY_PREFIX + surveyId);
      return raw ? (JSON.parse(raw) as SurveyResponse[]) : [];
    } catch {
      return [];
    }
  },
};

