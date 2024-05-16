import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

/**
 * An input used for number ranges e.g. timer, points
 * @param {object} props An object that contains text, value, min, max, step, name, onChange (responsible for changes in slider) for the input field
 * @returns JSX Element
 */
export default function SliderInput(props) {
    return (
        <div>
            <label className="form-label p-1 h5">{props.text}: {props.value}</label>
            <input
                type="range"
                className="form-range"
                min={props.min}
                max={props.max}
                step={props.step}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}