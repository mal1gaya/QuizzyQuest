import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useEffect } from 'react';
import { BASE_URL } from "../utils/constants";
import { getHeader } from "../utils/func-utils";
import QuizCard from "../components/QuizCard";
import { useNavigate } from "react-router-dom";
import { QuizType, ProcessState, Creator } from "../utils/enums";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import NavigationBar from "../components/NavigationBar";
import QuizCreatorCard from "../components/QuizCreatorCard";

export default function Dashboard() {
    const emptyData = () => ({data: [], process: ProcessState.Loading, error: ""});
    const onNavigate = useNavigate();
    const [multipleChoice, setMultipleChoice] = useState(emptyData());
    const [identification, setIdentification] = useState(emptyData());
    const [trueOrFalse, setTrueOrFalse] = useState(emptyData());
    const [createdMultipleChoice, setCreatedMultipleChoice] = useState(emptyData());
    const [createdIdentification, setCreatedIdentification] = useState(emptyData());
    const [createdTrueOrFalse, setCreatedTrueOrFalse] = useState(emptyData());
    const [tab, setTab] = useState({type: QuizType.MultipleChoice, creator: Creator.All});

    // wrapper for requesting server for getting the quizzes
    const apiCallWrapper = async (creator, type) => {
        try {
            const response = await fetch(`${BASE_URL}/quiz-routes/get-all${creator}quiz?type=${type}`, {
                method: "GET",
                headers: getHeader()
            });
            const data = await response.json();
            return {
                data: data || [],
                process: response.ok ? ProcessState.Success : ProcessState.Error,
                error: response.ok ? "" : data.error
            };
        } catch (error) {
            return {data: [], process: ProcessState.Error, error: error.toString()};
        }
    };

    // get created multiple choice quiz
    const scmc = async () => {
        setCreatedMultipleChoice(emptyData());
        setCreatedMultipleChoice(
            await apiCallWrapper(
                Creator.Self,
                QuizType.MultipleChoice
            )
        );
    };

    // get created identification quiz
    const sci = async () => {
        setCreatedIdentification(emptyData());
        setCreatedIdentification(
            await apiCallWrapper(
                Creator.Self,
                QuizType.Identification
            )
        );
    };

    // get created true or false quiz
    const sctof = async () => {
        setCreatedTrueOrFalse(emptyData());
        setCreatedTrueOrFalse(
            await apiCallWrapper(
                Creator.Self,
                QuizType.TrueOrFalse
            )
        );
    };

    // get other's multiple choice quiz
    const smc = async () => {
        setMultipleChoice(emptyData());
        setMultipleChoice(
            await apiCallWrapper(
                Creator.All,
                QuizType.MultipleChoice
            )
        );
    };

    // get other's identification quiz
    const si = async () => {
        setIdentification(emptyData());
        setIdentification(
            await apiCallWrapper(
                Creator.All,
                QuizType.Identification
            )
        );
    };

    // get other's true or false quiz
    const stof = async () => {
        setTrueOrFalse(emptyData());
        setTrueOrFalse(
            await apiCallWrapper(
                Creator.All,
                QuizType.TrueOrFalse
            )
        );
    };

    // invoke all functions that get different quizzes on the mount of page
    const apiCalls = [scmc, sci, sctof, smc, si, stof];
    useEffect(() => {
        apiCalls.forEach(func => {
            func();
        });
    }, []);

    // navigate to user's (quiz creator) profile
    const onProfileNavigate = (userId) => onNavigate(`/profile/${userId}`);

    // navigate to answering quiz when the quiz is not created by the user
    const onQuizNavigate = (quizId) => onNavigate(`/answer-quiz/${quizId}`);

    // navigate to about quiz when the quiz is created by the user
    const onAboutQuizNavigate = (quizId) => onNavigate(`/about-quiz/${quizId}`);

    // check what card to use (card that also show the user created it)
    const mapToQuizCard = (quiz, creator) => {
        return creator === Creator.All ? <QuizCard
            key={quiz}
            quiz={quiz}
            onProfileNavigate={() => onProfileNavigate(quiz.user.id)}
            navigate={() => onQuizNavigate(quiz.quiz_id)}
        /> : <QuizCreatorCard
            key={quiz}
            quiz={quiz}
            navigate={() => onAboutQuizNavigate(quiz.quiz_id)}
        />;
    };

    // get the data to show (e.g. created multiple choice quizzes or other's multiple choice quiz)
    const getCreator = (creator, first, second) => {
        return creator === Creator.Self ? first : second;
    };

    // show a component base on the current process state
    const checkProcess = (data, creator) => {
        switch (data.process) {
            case ProcessState.Loading:
                return <LoadingState />;
            case ProcessState.Error:
                return <ErrorState error={data.error} onRefresh={() => apiCalls.forEach(func => func())} />;
            case ProcessState.Success:
                return data.data.length > 0 ? 
                    data.data.map((quiz) => mapToQuizCard(quiz, creator)) : (
                        <div className="container-fluid">
                            <div className="d-flex flex-column min-vh-100">
                                <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                                    <h1>No available quizzes</h1>
                                </div>
                            </div>
                        </div>
                    );
        }
    };

    // get the quizzes to show (multiple choice, identification, true or false) (created by self, created by others)
    const getMenu = (type, creator) => {
        switch(type) {
            case QuizType.MultipleChoice:
                return checkProcess(getCreator(creator, createdMultipleChoice, multipleChoice), creator);
            case QuizType.Identification:
                return checkProcess(getCreator(creator, createdIdentification, identification), creator);
            case QuizType.TrueOrFalse:
                return checkProcess(getCreator(creator, createdTrueOrFalse, trueOrFalse), creator);
        }
    };

    return (
        <div>
            <NavigationBar />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand">Quizzes</span>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button
                                    className={"nav-link" + (tab.type === QuizType.MultipleChoice ? " active" : "")}
                                    onClick={() => {
                                        setTab({type: QuizType.MultipleChoice, creator: tab.creator});
                                    }}
                                >Multiple Choice</button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={"nav-link" + (tab.type === QuizType.Identification ? " active" : "")}
                                    onClick={() => {
                                        setTab({type: QuizType.Identification, creator: tab.creator});
                                    }}
                                >Identification</button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={"nav-link" + (tab.type === QuizType.TrueOrFalse ? " active" : "")}
                                    onClick={() => {
                                        setTab({type: QuizType.TrueOrFalse, creator: tab.creator});
                                    }}
                                >True or False</button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={"nav-link" + (tab.creator === Creator.All ? " active" : "")}
                                    onClick={() => {
                                        setTab({type: tab.type, creator: Creator.All});
                                    }}
                                >Quizzes by Others</button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={"nav-link" + (tab.creator === Creator.Self ? " active" : "")}
                                    onClick={() => {
                                        setTab({type: tab.type, creator: Creator.Self});
                                    }}
                                >Created Quizzes</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container-fluid">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 m-3">{getMenu(tab.type, tab.creator)}</div>
            </div>
        </div>
    );
}