import { useState } from "react";
import "antd/dist/antd.css";
import "../../css/Search.scss";
import { Button, Spin } from "antd";
import axios from "axios";
import SearchNews from "./SearchNews";

const Uploader = (props) => {
  const [image, setImage] = useState({
    image_file: "",
    preview_URL: "img/default_image.png",
  });

  const [loaded, setLoaded] = useState(false);

  let inputRef;
  const setTitle = (_Title) => {
    props.setTitle(_Title);
  };
  const saveImage = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files[0]) {
      setLoaded("loading");
      fileReader.readAsDataURL(e.target.files[0]);
    }
    fileReader.onload = () => {
      setImage({
        image_file: e.target.files[0],
        preview_URL: fileReader.result,
      });
      setLoaded(true);
    };
  };

  const sendImageToServer = async () => {
    if (image.image_file) {
      const formData = new FormData();
      formData.append("file", image.image_file);
      await axios.post("/api/image/upload", formData);
      alert("서버에 등록이 완료되었습니다!");
      setImage({
        image_file: "",
        preview_URL: "img/default_image.png",
      });
      setLoaded(false);
    } else {
      alert("사진을 등록하세요!");
    }
  };

  return (
    <div className="uploader-wrapper">
      <input
        type="file"
        accept="image/*"
        onChange={saveImage}
        ref={(refParam) => (inputRef = refParam)}
        style={{ display: "none" }}
      />
      <div className="img-wrapper">
        {loaded === false || loaded === true ? (
          <img src={image.preview_URL} />
        ) : (
          <Spin className="img-spinner" tip="이미지 불러오는중" />
        )}
      </div>

      <div className="upload-button">
        <Button
          type="primary"
          id="image_upload"
          onClick={() => inputRef.click()}
        >
          이미지 업로드
        </Button>
        <Button type="primary" onClick={null} danger>
          촬영 하여 업로드
        </Button>
        <Button type="ghost" id="search_btn" onClick={sendImageToServer}>
          검색
        </Button>
        <SearchNews title={props.title} setTitle={setTitle}></SearchNews>
      </div>
    </div>
  );
};

export default Uploader;
