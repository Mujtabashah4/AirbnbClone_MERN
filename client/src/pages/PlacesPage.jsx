import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../PerksLabels";
import axios from "axios";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);

  function inputHeader(text) {
    return <h2 className='text-2xl mt-4'>{text}</h2>;
  }
  function preInput(header) {
    return <>{inputHeader(header)}</>;
  }
  async function addPhotoByLink(e) {
    e.preventDefault();
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });

      setAddedPhotos((prevPhotos) => [...prevPhotos, filename]);
      setPhotoLink(""); // Reset the input field
    } catch (error) {
      // Handle any potential errors from the API request
      console.error("Error adding photo:", error);
    }
  }
  function uploadPhoto(e) {
    const files = e.target.files;
    // console.log({ files });
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    const data = new FormData();

    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filename } = response;
        setAddedPhotos((prevPhotos) => [...prevPhotos, filename]);
        setPhotoLink("");
      });
  }
  //   function uploadPhoto(ev) {
  //     const files = ev.target.files;
  //     const data = new FormData();
  //     for (let i = 0; i < files.length; i++) {
  //       data.append("photos", files[i]);
  //     }
  //     axios
  //       .post("/upload", data, {
  //         headers: { "Content-type": "multipart/form-data" },
  //       })
  //       .then((response) => {
  //         const { data: filenames } = response;
  //         // eslint-disable-next-line no-undef
  //         onChange((prev) => {
  //           return [...prev, ...filenames];
  //         });
  //       });
  //   }

  return (
    <div>
      {action !== "new" && (
        <div className='text-center'>
          <Link
            className='inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full'
            to={"/account/places/new"}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v12m6-6H6'
              />
            </svg>
            Add New Place
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <h1 className='text-center text-2xl'>Enter New Place</h1>
          <form>
            {preInput("Title")}
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title'
            />
            {preInput("Address")}
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Address'
            />
            {preInput("Photos")}
            <div className='flex gap-2'>
              <input
                value={photoLink}
                type='text'
                placeholder='Add photo using link'
                onChange={(e) => setPhotoLink(e.target.value)}
              />
              <button
                onClick={addPhotoByLink}
                className='bg-primary items-center px-4 rounded-xl text-white'
              >
                Upload&nbsp; Photo
              </button>
            </div>

            <div className='mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
              {addedPhotos.length > 0 &&
                addedPhotos.map((link, index) => (
                  <div key={index}>
                    <img
                      className='rounded-2xl '
                      src={"http://localhost:5173/uploads/" + link}
                      alt=''
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                ))}

              <label className='h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600'>
                <input
                  type='file'
                  multiple
                  className='hidden'
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75'
                  />
                </svg>
                Upload
              </label>
            </div>
            {preInput("Description")}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {preInput("Perks")}
            <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput("Extra Information")}
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />
            <h2 className='text-2xl mt-4'>Check in&out times </h2>
            <p className='text-gray-500 text-sm'>
              Add check in and out times, remember to have some time window for
              cleaning the room between guests
            </p>
            <div className='grid gap-2 sm:grid-cols-3'>
              <div>
                <h3 className='mt-2 -mb-1'>Check in time</h3>
                <input
                  type='text'
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  placeholder='14:00'
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Check out time</h3>
                <input
                  type='text'
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  placeholder='11:00'
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Max number of guests</h3>
                <input
                  type='number'
                  placeholder='12'
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                />
              </div>
            </div>
            <button className='primary my-4'>Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
