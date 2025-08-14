


import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, useParams, useNavigate, Link, Navigate, Outlet } from 'react-router-dom';
import { Survey, SurveyResponse, GeminiAnalysis, DrawflowData, User } from './types';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import { authService } from './services/authService';
import { Builder } from './components/Builder';
import { Runner } from './components/Runner';
import { Button, Card, Spinner, Modal } from './components/ui';

// --- ICONS ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1.586l.707.707a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0l-.707-.707V3a1 1 0 011-1zm10 0a1 1 0 011 1v1.586l.707.707a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0l-.707-.707V3a1 1 0 011-1zM3 8a1 1 0 011 1v5.586l.707.707a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0l-.707-.707V9a1 1 0 011-1zm14 0a1 1 0 011 1v5.586l.707.707a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0l-.707-.707V9a1 1 0 011-1zM10 4a1 1 0 011 1v1.586l.707.707a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0l-.707-.707V5a1 1 0 011-1zm0 10a1 1 0 011 1v1.586l.707.707a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0l-.707-.707V15a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const PreviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;


// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>(null!);

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };
  
  // This effect will re-sync the user state if localStorage changes in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// --- ROUTING ---
const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// --- LAYOUTS ---
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="min-h-screen flex flex-col">{children}</div>;
};

// --- PAGES ---

// Dashboard Page
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSurveyTitle, setNewSurveyTitle] = useState('');
  const [newSurveyPrompt, setNewSurveyPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareModal, setShareModal] = useState<{ open: boolean, url: string }>({ open: false, url: '' });

  useEffect(() => {
    setSurveys(storageService.getSurveys());
  }, []);

  const handleCreateSurvey = async () => {
      if (!newSurveyTitle.trim() || !user) return;
      setIsGenerating(true);
      try {
          let schema: DrawflowData = { drawflow: { Home: { data: {} } } };
          if(newSurveyPrompt.trim()){
              schema = await geminiService.generateSurveyFlow(newSurveyPrompt);
          }
          const newSurvey: Survey = {
            id: `survey_${Date.now()}`,
            userId: user.id,
            title: newSurveyTitle,
            createdAt: Date.now(),
            schema: schema,
          };
          storageService.saveSurvey(newSurvey);
          navigate(`/survey/${newSurvey.id}/build`);
      } catch (error) {
          console.error("Failed to generate survey:", error);
          alert("There was an error generating the survey from your prompt. Please try again.");
      } finally {
          setIsGenerating(false);
          setIsCreating(false);
          setNewSurveyTitle('');
          setNewSurveyPrompt('');
      }
  };

  const handleDeleteSurvey = (id: string) => {
    if (window.confirm('Are you sure you want to delete this survey and all its responses?')) {
      storageService.deleteSurvey(id);
      setSurveys(surveys.filter(s => s.id !== id));
    }
  };
  
  const handleOpenShareModal = (surveyId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/survey/${surveyId}/run`;
    setShareModal({ open: true, url });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareModal.url);
    alert('Link copied to clipboard!');
  };


  return (
    <>
      <DashboardHeader onLogout={useAuth().logout} userEmail={user?.email || ''} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={() => setIsCreating(!isCreating)} variant="primary">
              <PlusIcon /> <span className="ml-2">New Survey</span>
            </Button>
          </div>

          {isCreating && (
            <Card className="mb-6 bg-brand-surface-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Create New Survey</h2>
                <input
                  type="text"
                  value={newSurveyTitle}
                  onChange={e => setNewSurveyTitle(e.target.value)}
                  placeholder="Enter survey title..."
                  className="w-full p-2 border border-brand-border rounded-lg"
                />
                 <div className="relative">
                  <textarea
                    value={newSurveyPrompt}
                    onChange={e => setNewSurveyPrompt(e.target.value)}
                    placeholder="Optional: Describe your survey and let AI generate it... (e.g., 'a customer satisfaction survey for a coffee shop')"
                    className="w-full p-2 pr-10 border border-brand-border rounded-lg"
                    rows={3}
                  />
                  <div className="absolute top-2 right-3 text-brand-muted">
                    <SparklesIcon />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                   <Button variant="secondary" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button onClick={handleCreateSurvey} disabled={!newSurveyTitle.trim() || isGenerating}>
                    {isGenerating ? <Spinner /> : 'Create & Edit'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="text-xl font-semibold mb-4">Your Surveys</h2>
            {surveys.length > 0 ? (
              <ul className="divide-y divide-brand-border">
                {surveys.map(survey => (
                  <li key={survey.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{survey.title}</h3>
                      <p className="text-sm text-brand-muted">Created: {new Date(survey.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="secondary" onClick={() => navigate(`/survey/${survey.id}/build`)}><EditIcon/> <span className="ml-1">Edit</span></Button>
                      <Button variant="secondary" onClick={() => navigate(`/survey/${survey.id}/run`)}><PlayIcon/> <span className="ml-1">Run</span></Button>
                      <Button variant="secondary" onClick={() => navigate(`/survey/${survey.id}/analysis`)}><ChartIcon/> <span className="ml-1">Analyze</span></Button>
                      <Button variant="secondary" onClick={() => handleOpenShareModal(survey.id)}><ShareIcon/> <span className="ml-1">Share</span></Button>
                      <Button variant="danger" onClick={() => handleDeleteSurvey(survey.id)}><TrashIcon/></Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-brand-muted py-8">You haven't created any surveys yet.</p>
            )}
          </Card>
        </div>
      </main>
      
      {shareModal.open && (
        <Modal title="Share Survey" onClose={() => setShareModal({open: false, url: ''})}>
            <p className="mb-4">Anyone with this link can take your survey.</p>
            <input type="text" readOnly value={shareModal.url} className="w-full p-2 border border-brand-border rounded-lg bg-gray-100" />
            <div className="mt-4 flex justify-end">
                <Button onClick={copyToClipboard}>Copy Link</Button>
            </div>
        </Modal>
      )}
    </>
  );
};

const DashboardHeader = ({ onLogout, userEmail }: { onLogout: () => void, userEmail: string }) => (
  <header className="bg-brand-surface border-b border-brand-border shadow-sm p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold text-brand-primary">Visual Survey</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-brand-muted hidden sm:block">{userEmail}</span>
        <Button onClick={onLogout} variant="secondary">
          <LogoutIcon />
          <span className="ml-2 hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  </header>
);

const BuilderPage = () => {
    const { surveyId } = useParams<{ surveyId: string }>();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | null>(null);

    useEffect(() => {
        if (!surveyId) {
            navigate('/');
            return;
        }
        const foundSurvey = storageService.getSurvey(surveyId);
        if (foundSurvey) {
            setSurvey(foundSurvey);
        } else {
            alert('Survey not found!');
            navigate('/');
        }
    }, [surveyId, navigate]);

    const handleUpdateTitle = (newTitle: string) => {
        if (survey && newTitle.trim()) {
            const updatedSurvey = { ...survey, title: newTitle.trim() };
            setSurvey(updatedSurvey);
            storageService.saveSurvey(updatedSurvey);
        }
    };
    
    const handleSave = (newSchema: DrawflowData) => {
        if (survey) {
            const updatedSurvey = { ...survey, schema: newSchema };
            setSurvey(updatedSurvey);
            storageService.saveSurvey(updatedSurvey);
        }
    };
    
    const handleSaveAndClose = (newSchema: DrawflowData) => {
        if (survey) {
            const updatedSurvey = { ...survey, schema: newSchema };
            storageService.saveSurvey(updatedSurvey);
        }
        navigate('/');
    };

    if (!survey) return <div className="flex-1 flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="flex flex-col flex-1" style={{height: '100vh'}}>
            <BuilderHeader survey={survey} onUpdateTitle={handleUpdateTitle} />
            <Builder survey={survey} onSave={handleSave} onSaveAndClose={handleSaveAndClose} />
        </div>
    );
};

const BuilderHeader = ({ survey, onUpdateTitle }: { survey: Survey, onUpdateTitle: (t: string) => void }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(survey.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditingTitle) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditingTitle]);
    
    useEffect(() => {
        setTitle(survey.title);
    }, [survey.title]);

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        onUpdateTitle(title);
    };
    
    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') handleTitleBlur();
        if(e.key === 'Escape') {
            setTitle(survey.title);
            setIsEditingTitle(false);
        }
    }
    
    const handlePreview = () => {
        window.open(`${window.location.origin}${window.location.pathname}#/survey/${survey.id}/run`, '_blank');
    };
    
     const handleShare = () => {
        const url = `${window.location.origin}${window.location.pathname}#/survey/${survey.id}/run`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Share link copied to clipboard!');
        }, (err) => {
            alert('Could not copy link.');
            console.error('Could not copy text: ', err);
        });
    };
    
    const handleBackToDashboard = () => {
        navigate('/');
    };

    return (
        <header className="bg-brand-surface border-b border-brand-border shadow-sm p-3 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
                <button onClick={handleBackToDashboard} className="p-2 rounded-md hover:bg-gray-100"><BackIcon /></button>
                 {isEditingTitle ? (
                    <input 
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        className="text-xl font-bold p-1 -m-1 border border-blue-400 rounded-md bg-white"
                    />
                 ) : (
                    <h1 onClick={() => setIsEditingTitle(true)} className="text-xl font-bold cursor-pointer p-1 -m-1 rounded-md hover:bg-gray-100">{survey.title}</h1>
                 )}
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleShare} variant="secondary"><ShareIcon /><span className="ml-2 hidden sm:inline">Share</span></Button>
                <Button onClick={handlePreview} variant="secondary"><PreviewIcon /><span className="ml-2 hidden sm:inline">Preview</span></Button>
            </div>
        </header>
    );
};


const RunnerPage = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    if (surveyId) {
      const s = storageService.getSurvey(surveyId);
      setSurvey(s || null);
    }
  }, [surveyId]);

  if (!survey) return <Card className="text-center m-8"><p>Loading survey...</p></Card>;

  return (
    <div className="p-4 bg-brand-bg min-h-screen">
      <Runner survey={survey} onFinish={() => {
        alert('Thank you for completing the survey!');
        // Instead of navigating, show a thank you message.
        // The user can close the tab.
        const root = document.getElementById('root');
        if(root) {
            root.innerHTML = '<div class="min-h-screen flex items-center justify-center"><div class="text-center p-8 bg-white rounded-lg shadow-lg"> <h1 class="text-3xl font-bold text-brand-primary mb-4">Thank You!</h1> <p class="text-brand-muted">Your response has been recorded.</p> </div></div>'
        }
      }} />
    </div>
  );
};


const AnalysisPage = () => {
    const { surveyId } = useParams<{ surveyId: string }>();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!surveyId) {
            navigate('/');
            return;
        }
        const foundSurvey = storageService.getSurvey(surveyId);
        if (foundSurvey) {
            setSurvey(foundSurvey);
            setResponses(storageService.getResponses(surveyId));
        } else {
            alert('Survey not found!');
            navigate('/');
        }
    }, [surveyId, navigate]);

    const handleRunAnalysis = async () => {
        if (!survey || responses.length === 0) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await geminiService.analyzeResponses(survey.title, responses);
            setAnalysis(result);
        } catch (e: any) {
            console.error("Analysis failed:", e);
            setError(`Failed to analyze responses. ${e.message}`);
        }
        setIsLoading(false);
    };

    if (!survey) return <div className="flex-1 flex items-center justify-center"><Spinner /></div>;
    
    return (
        <>
        <header className="bg-brand-surface border-b border-brand-border shadow-sm p-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                <Link to="/" className="p-2 rounded-md hover:bg-gray-100"><BackIcon /></Link>
                <div>
                    <h1 className="text-xl font-bold">Analysis for "{survey.title}"</h1>
                    <p className="text-sm text-brand-muted">{responses.length} response(s)</p>
                </div>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {responses.length > 0 ? (
                    <div className="text-center mb-8">
                        <Button onClick={handleRunAnalysis} disabled={isLoading}>
                            {isLoading ? <><Spinner /> Analyzing...</> : <><SparklesIcon /> Generate AI Analysis</>}
                        </Button>
                    </div>
                ) : (
                    <Card className="text-center">
                        <p className="text-lg">No responses yet.</p>
                        <p className="text-brand-muted">Share your survey to collect responses first.</p>
                    </Card>
                )}
                
                {error && <Card className="bg-red-50 border-red-200 text-red-700 mb-6"><p><strong>Error:</strong> {error}</p></Card>}

                {isLoading && (
                    <Card className="flex flex-col items-center justify-center py-12">
                        <Spinner />
                        <p className="mt-4 text-brand-muted animate-pulse">Running Gemini analysis... this may take a moment.</p>
                    </Card>
                )}

                {analysis && !isLoading && (
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-2xl font-bold mb-3">Overall Summary</h2>
                            <p className="text-brand-muted prose max-w-full">{analysis.overallSummary}</p>
                        </Card>
                         <Card>
                            <h2 className="text-2xl font-bold mb-3">Key Insights</h2>
                            <ul className="list-disc list-inside space-y-2 text-brand-text">
                                {analysis.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                            </ul>
                        </Card>
                         <div className="grid md:grid-cols-3 gap-6">
                            <Card>
                               <h3 className="font-bold text-lg mb-2 text-green-700">Positive Themes</h3>
                               <ul className="list-disc list-inside text-sm space-y-1">{analysis.sentiment.positive_themes.map((theme, i) => <li key={i}>{theme}</li>)}</ul>
                            </Card>
                            <Card>
                               <h3 className="font-bold text-lg mb-2 text-red-700">Negative Themes</h3>
                               <ul className="list-disc list-inside text-sm space-y-1">{analysis.sentiment.negative_themes.map((theme, i) => <li key={i}>{theme}</li>)}</ul>
                            </Card>
                             <Card>
                               <h3 className="font-bold text-lg mb-2 text-slate-700">Neutral Themes</h3>
                               <ul className="list-disc list-inside text-sm space-y-1">{analysis.sentiment.neutral_themes.map((theme, i) => <li key={i}>{theme}</li>)}</ul>
                            </Card>
                        </div>
                        <Card>
                            <h2 className="text-2xl font-bold mb-3">Actionable Recommendations</h2>
                            <ul className="list-decimal list-inside space-y-2 text-brand-text">
                                {analysis.actionableRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </Card>
                    </div>
                )}
            </div>
        </main>
        </>
    );
};


const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            authService.login(email, password);
            // Force a reload to re-initialize the AuthProvider with the new user
            window.location.hash = '/';
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <Card className="w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded-lg" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded-lg" />
                    <Button type="submit" className="w-full">Login</Button>
                </form>
                <p className="text-center text-sm mt-4">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
            </Card>
        </div>
    );
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            authService.register(email, password);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <Card className="w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                 {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded-lg" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded-lg" />
                    <Button type="submit" className="w-full">Register</Button>
                </form>
                <p className="text-center text-sm mt-4">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
            </Card>
        </div>
    );
};

// --- APP ENTRYPOINT ---
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/survey/:surveyId/run" element={<RunnerPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/survey/:surveyId/build" element={<BuilderPage />} />
                    <Route path="/survey/:surveyId/analysis" element={<AnalysisPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default function AppWrapper() {
  return (
    <HashRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </HashRouter>
  );
}