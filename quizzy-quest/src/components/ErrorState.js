import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

/**
 * A component used when the process state is error or server request return failure/error response and no data has received and be shown in user interface.
 * @param {object} props an object with two properties (onRefresh and error). error is a message/text about the error and onRefresh is a callback function that should trigger refresh to page/tab when refresh button clicked.
 * @returns JSX Element
 */
export default function ErrorState(props) {
    return (
        <div className="container-fluid">
            <div className="d-flex flex-column min-vh-100">
                <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                    <div className="col-6">
                        <p className="fs-2 text-center">Something went wrong</p>
                        <div className="text-center">
                            <button type="button" className="btn btn-primary my-3" onClick={props.onRefresh}>Refresh</button>
                        </div>
                        <p className="fs-5 text-center">{props.error}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}