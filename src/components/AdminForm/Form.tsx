import { connect } from "react-redux";
import { setPlaceFormVisibility } from "../../store/actions";
import { IState } from "../../store/models";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import { LatLng } from "leaflet";
import { fstore } from "../../firebase";

const Form = ({
  isVisible,
  position,
  closeForm,
}: {
  isVisible: boolean;
  position: LatLng;
  closeForm: Function;
}) => {


  const initialValues = {
    key: "",
    picture: "",
    title: "",
    description: "",
    quantity: ""
  };

  const validator = (values: PlaceFormProps) => {
    const keys = Object.keys(values);

    return keys.reduce((prev, curr) => {
      if (!values[curr]) {
        return { ...prev, [curr]: "required" };
      }
      console.log(prev)
      return prev;
    }, {});
  };

  const handleOnSubmit = (values: PlaceFormProps, {setSubmitting, resetForm}:{setSubmitting: any, resetForm: any}) => {
    if(values.key=="VALID"){
      fstore.collection("publicplaces").add({
        ...values,
        position: [position.lat, position.lng]
      })
      closeForm();
      resetForm();
    }
    else{
      console.log("invalid distributor key");
      closeForm();
      resetForm();
    }
  }

  return (
    <div
      className={`form__container form__container--${isVisible && "active"}`}
    >
      <div className="form__header">
        <span
          className="form__header__close"
          role="button"
          onClick={() => closeForm()}
        >
          <AiFillCloseCircle />
        </span>
        <span className="form__header__title">AGREGAR / ADD </span>
      </div>
      <Formik
        initialValues={initialValues}
        validate={(validator)}
        onSubmit={handleOnSubmit}
      >
        {({ errors, touched, isValidating }) => (
          <FormikForm>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="key">CLAVE DE SOCIO / PARTNER KEY</label>
                <Field id="key" name="key" placeholder="" />
              </div>
              {errors.key && <div className="errors">Required</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="picture">SUBIR FOTO / UPLOAD PICTURE</label>
                <Field id="picture" name="picture" placeholder="" />
              </div>
              {errors.picture && <div className="errors">Required</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="title"> TÍTULO / TITLE</label>
                <Field id="title" name="title" placeholder="" />
              </div>
              {errors.title && <div className="errors">Required</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="description">DESCRIPCIÓN / DESCRIPTION</label>
                <Field
                  id="description"
                  name="description"
                  placeholder=""
                />
              </div>
              {errors.description && <div className="errors">Required</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="quantity">CANTIDAD / QUANTITY</label>
                <Field
                  id="quantity"
                  name="quantity"
                  placeholder=""
                />
              </div>
              {errors.quantity && <div className="errors">Required</div>}
            </div>
            <div className="button__container">
              <button className="form__button" type="submit">ENVIAR / SUBMIT</button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { places } = state;
  return {
    isVisible: places.placeFormIsVisible,
    position: places.prePlacePosition as LatLng,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeForm: () =>
      dispatch(setPlaceFormVisibility(false)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

interface PlaceFormProps {
  [key: string]: string;
  picture: string;
  title: string;
  description: string;
}
