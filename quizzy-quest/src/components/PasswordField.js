import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * A text input field used for passwords
 * @param {object} props An object that contains placeholder, type (password), name, value, onChange (responsible for changes of text input field value), onClick (for toggling type (text/password)) for the input field.
 * @returns JSX Element
 */
export default function PasswordField(props) {
    return (
        <div>
            <label className="form-label p-1 h5">{props.placeholder}</label>
            <div className="input-group py-2">
                <input
                    type={props.type}
                    placeholder={"Enter " + props.placeholder}
                    name={props.name}
                    className="form-control p-2"
                    value={props.value}
                    onChange={props.onChange}
                    required={true}
                />
                <div className="input-group-append">
                    <span className="input-group-text py-2 px-3" onClick={props.onClick}>
                        <i className={`bi bi-eye${props.type === "password" ? "" : "-slash"}`}></i>
                    </span>
                </div>
            </div>
        </div>
    );
}