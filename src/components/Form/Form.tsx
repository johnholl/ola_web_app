import { useState } from "react";
import { connect } from "react-redux";
import { message, Upload, Button, Spin, Row, Tooltip} from "antd";
import { LoadingOutlined, UploadOutlined, InfoCircleOutlined} from '@ant-design/icons';
import { setPlaceFormVisibility } from "../../store/actions";
import { IState } from "../../store/models";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import { LatLng } from "leaflet";
import { storage, functions } from "../../firebase";
import makeId from "../../utils";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const addMarker = functions.httpsCallable("addMarker"); 

const Form = ({
  isVisible,
  position,
  closeForm,
}: {
  isVisible: boolean;
  position: LatLng;
  closeForm: Function;
}) => {

  const [photoUrl, setPhotoUrl] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    key: "",
    title: "",
    description: "",
    quantity: ""
  };

  const validator = (values: PlaceFormProps) => {
    const keys = Object.keys(values);
    return keys.reduce((prev, curr) => {
      if (!values[curr] && curr !="description") {
        return { ...prev, [curr]: "required" };
      }
      return prev;
    }, {});
  };

  const handleOnSubmit = async (values: PlaceFormProps, {resetForm}:{resetForm: any}) => {
    setSubmitting(true);
    const result = await addMarker({photoUrl: photoUrl, 
      photoName: photoName,
      key: values.key,
      title: values.title, 
      description: values.description,
      quantity: values.quantity,
      position: position,
      hide: false})
    setPhotoUrl(false);
    setPhotoName("");
    setSubmitting(false);
    closeForm();
    resetForm();
  }

    const customUpload = async (options : any) => {
      const metadata = {
          contentType: 'image/jpeg'
      }
      const storageRef = storage.ref();
      const imageName = makeId(8); //a unique name for the image
      const imgFile = storageRef.child(`${imageName}`);
      try {
        const image = await imgFile.put(options.file, metadata);
        const url = await image.ref.getDownloadURL();
        setPhotoUrl(url);
        setPhotoName(imageName)
        setPhotoLoading(false);
        options.onSuccess(null, image);
      } catch(e) {
        options.onError(e);
      }
    };

    const beforeUpload = (file: any) => {
      const isImage = file.type.indexOf('image/') === 0;
      if (!isImage) {
        message.error('You can only upload image files');
      }
      
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error('Image must smaller than 20MB');
      }
      return isImage && isLt20M;
    };

    const onChange = (info: any) => {
      if (info.file.status === 'uploading') {
        setPhotoLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        setPhotoLoading(false);
      };
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
        <span className="form__header__title">
          <Tooltip title="Information in this form, including images, may be used by Ola Filters in social media posts">
            <InfoCircleOutlined/>
          </Tooltip>
          <span style={{paddingLeft: 10}}>Add / Agregar</span>
        </span>
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
                <label htmlFor="key">Partner Key / Clave de Socio</label>
                <Field id="key" name="key" placeholder="" />
              </div>
              {errors.key && <div className="errors">Required</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput" >
                <label htmlFor="key">Add Image / Añadir Imagen</label>
                <Row align="middle" justify="start">
                  <Upload onChange={onChange} beforeUpload={beforeUpload} customRequest={customUpload}><Button icon={<UploadOutlined />}>{!photoLoading ? "Upload / Subir" : <Spin indicator={antIcon} style={{ paddingLeft: 10 }} />}</Button></Upload>
                  {/* <div>{photoUrl && <CheckCircleOutlined style={{color:"darkgreen", fontSize:"24px"}}/>}</div> */}
                </Row>
              </div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="title"> Title / Título</label>
                <Field id="title" name="title" placeholder="" />
              </div>
              {errors.title && <div className="errors">Required</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="description">Description / Descripción</label>
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
                <label htmlFor="quantity">Quantity / Cantidad</label>
                <Field
                  id="quantity"
                  name="quantity"
                  placeholder=""
                />
              </div>
              {errors.quantity && <div className="errors">Required</div>}
            </div>
            <div className="button__container">
              <button className="form__button" type="submit" style={{backgroundColor:"#52b2bf"}}>
                {submitting ? <Spin indicator={antIcon} style={{ paddingLeft: 10 }} /> : "Submit / Enviar"}</button>
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
  title: string;
  description: string;
}
