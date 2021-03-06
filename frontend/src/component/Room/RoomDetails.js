/* eslint-disable jsx-a11y/anchor-is-valid */
import "./RoomDetails.css";

import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { Rating } from "@material-ui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

import Loading from "../layout/loading/loading";
import TimeAgo from "../../utils/TimeAgo";
import ReviewCard from "./ReviewCard.js";
import MetaData from "../layout/MetaData";
import {
  getRoomDetails,
  clearErrors,
  newReview,
} from "../../actions/roomAction";
import { NEW_REVIEW_RESET } from "../../constants/roomConstants";

// Swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Lazy, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/lazy";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Map from "../Map/Map";

const RoomDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useSelector((state) => state.user);
  const { room, loading, error } = useSelector((state) => state.roomDetails);
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getRoomDetails(id));
  }, [alert, dispatch, error, id, reviewError, success]);

  const submitReviewToggle = () => {
    if (user._id === room.user?._id) {
      alert.error("Kh??ng th??? t??? ????nh gi?? ph??ng c???a ch??nh m??nh !");
      return;
    }
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("roomID", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  const bookingHandler = () => {
    navigate("/login?redirect=booking", {
      state: { room: room },
    });
    if (user && user._id === room.user?._id) {
      alert.error("Kh??ng th??? t??? ?????t ph??ng c???a ch??nh m??nh !");
      return;
    } else if (
      user &&
      user.name === "undefined" &&
      user.phoneNumber === "undefined"
    ) {
      alert.error("Th??ng tin h??? t??n ho???c S??T c??n tr???ng !");
      return;
    } else {
      navigate("/login?redirect=booking", {
        state: { room: room },
      });
    }
  };

  const options = {
    size: "large",
    value: room.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title={room.name} />
          <div className="BREADCRUMB">BREADCRUMB vd: Home/Category/Room</div>

          <div className="containerDetails">
            <div
              className="containerSlide"
              style={{ width: room.images?.length === 1 ? "84%" : "72%" }}
            >
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                pagination={{
                  type: "fraction",
                }}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                centeredSlides={true}
                navigation={true}
                loop={false}
                lazy={true}
                effect={"fade"}
                modules={[Navigation, Pagination, EffectFade, Lazy, Autoplay]}
              >
                {room.images &&
                  room.images.map((item, i) => (
                    <SwiperSlide key={i}>
                      <img src={item.url} alt={`img ${i}`} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            <div className="containerPosterInfor">
              <h1>NG?????I ????NG</h1>
              <img src={room.user?.avatar.url} alt="" />
              <div className="posterName">{room.user?.name}</div>

              <a
                className="contact posterPhoneNumber"
                rel="nofollow"
                href={`tel:${room.user?.phoneNumber}`}
              >
                <i />
                {room.user?.phoneNumber}
              </a>

              <a
                className="contact posterZalo"
                rel="nofollow noreferrer"
                target="_blank"
                href={`https://zalo.me/${room.user?.phoneNumber}`}
              >
                <i />
                Li??n h??? Zalo
              </a>

              <a
                className="contact message"
                rel="nofollow noreferrer"
                target="_blank"
                href=""
              >
                <i />
                Nh???n tin
              </a>
            </div>
          </div>

          <div className="containerRoom">
            <div className="roomHeader">
              <a rel="nofollow" href="">
                {room.name}
              </a>
              <div className="roomAttributes">
                <div className="roomPrice">
                  <i />
                  <span>{room.price?.toLocaleString("en-US")} VN??/th??ng</span>
                </div>
                <div className="attribute roomArea">
                  <i />
                  <span>{room.area} &#x33A1;</span>
                </div>
                <div className="attribute roomTime">
                  <i />
                  {TimeAgo(room.createdAt)}
                </div>
                <div className="attribute roomID">
                  <i />
                  {room._id}
                </div>
              </div>
              <h1 className="h1-header">M?? t???</h1>
              <p className="roomDescription">
                {room.description?.split("\n").map(function (element, i) {
                  return (
                    <span key={i}>
                      {element}
                      <br />
                    </span>
                  );
                })}
              </p>
              <h1 className="h1-header">Th??ng tin chi ti???t</h1>
              <table>
                <tbody>
                  <tr>
                    <th>M?? ph??ng</th>
                    <td>{room._id}</td>
                  </tr>
                  <tr>
                    <th>?????a ch???</th>
                    <td>{room.address}</td>
                  </tr>

                  <tr>
                    <th>Lo???i ph??ng</th>
                    <td>{room.category}</td>
                  </tr>

                  <tr>
                    <th>Di???n t??ch</th>
                    <td>{room.area} &#x33A1;</td>
                  </tr>
                  <tr>
                    <th>Gi?? ph??ng</th>
                    <td>{room.price?.toLocaleString("en-US")} VN??</td>
                  </tr>
                  <tr>
                    <th>S??? ph??ng c??n l???i</th>
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {room.numOfRooms}
                    </td>
                  </tr>
                  <tr>
                    <th>?????i t?????ng</th>
                    <td>{room.tenant}</td>
                  </tr>
                  <tr>
                    <th>Ng??y ????ng</th>
                    <td>{new Date(room.createdAt).toLocaleString("en-GB")}</td>
                  </tr>
                </tbody>
              </table>
              <h1 className="h1-header">Th??ng tin ng?????i ????ng</h1>
              <table>
                <tbody>
                  <tr>
                    <th>Li??n h???</th>
                    <td>{room.user?.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{room.user?.email}</td>
                  </tr>
                  <tr>
                    <th>??i???n tho???i</th>
                    <td>{room.user?.phoneNumber}</td>
                  </tr>
                  <tr>
                    <th>Zalo</th>
                    <td>{room.user?.phoneNumber}</td>
                  </tr>
                </tbody>
              </table>
              <h1 className="h1-header">B???n ?????</h1>
              <div className="roomDetailsAddressLabel">
                ?????a ch???: {room.address}
              </div>
              <div className="roomDetailsAddressMap">
                <Map
                  zoom={16}
                  lat={room.lat}
                  lng={room.lng}
                  noSearch={true}
                ></Map>
              </div>
              <h1 className="h1-header">????nh gi?? ph??ng</h1>
              <div className="totalRating">
                <div>
                  <span className="roomRating">{room.rating}</span>
                  <span className="maxRating"> tr??n 5</span>
                </div>
                <Rating className="stars" {...options} />
              </div>
              {room.reviews && room.reviews[0] ? (
                <div className="reviews">
                  {room.reviews &&
                    room.reviews.map((review, index) => (
                      <ReviewCard key={index} review={review} />
                    ))}
                </div>
              ) : (
                <p className="noReviews">Ch??a c?? ????nh gi?? n??o</p>
              )}
            </div>

            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={submitReviewToggle}
            >
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent className="submitDialog">
                <Rating
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  name="unique-rating"
                  // precision={0.5}
                  max={5}
                  size="large"
                />

                <textarea
                  className="submitDialogTextArea"
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button onClick={reviewSubmitHandler} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            <div className="userActivity">
              <button className="btn" onClick={bookingHandler}>
                ?????t ph??ng
              </button>
              <button onClick={submitReviewToggle} className="btn">
                ????nh gi??
              </button>
              <button className="btn">Report</button>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default RoomDetails;
