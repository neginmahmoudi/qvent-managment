import { ArrowLeftCircle } from '@emotion-icons/bootstrap';
import { Delete } from '@emotion-icons/fluentui-system-regular';
import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category, getCategories } from '../../../database/categories';
import { Event, getEventByLogedInUser } from '../../../database/events';
import { getUserBySessionToken } from '../../../database/users';

const flexStyles = css`
  display: flex;
`;
const containerStyles = css`
  background-color: #f5eee1;
  display: flex;
  margin: 0 auto;
  width: 450px;
  height: 700px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 50px;
  flex-direction: column;
  align-items: center;
  font-family: cursive;
  textarea {
    border: none;
    border-radius: 5px;
    padding: 8px;
    width: 300px;
    height: 100px;
  }
  input {
    border: none;
    font-family: monospace;
    border-radius: 5px;
    padding: 8px;
    background-color: white;
  }
  label {
    margin-left: 10px;
  }

  select {
    border: none;
    border-radius: 5px;
    padding: 8px;
  }
  a {
    color: black;
    font-size: larger;
    text-decoration: none;
    margin-left: 60px;
    :hover {
      :hover {
        cursor: pointer;
        color: #d04e59;
      }
    }
  }
`;
const eventStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: cursive;
  margin-bottom: 30px;
  width: 500px;
  background-color: #3ab8a9;
  height: 70px;
  border-radius: 25px;
  color: white;
  a {
    text-decoration: none;
    color: white;
    margin-right: 20px;
    :hover {
      color: #d04e59;
    }
  }
  button {
    padding: 5px;
    width: 60px;
    border-radius: 10px;
    margin-right: 10px;
    background-color: #87007b;
    color: #f3f8e6;
    :hover {
      cursor: pointer;
      box-shadow: 4px 4px grey;
    }
  }
  div {
    margin-left: 30px;
  }
`;
const mapStyles = css`
  margin-right: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: cursive;
  input {
    width: 480px;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 40px;
  }
`;
const imgStyles = css`
  margin-top: 5px;
  margin-left: 9px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-family: cursive;
  font-size: 10px;
`;
const btn2Styles = css`
  padding: 10px;
  width: 120px;
  border: none;
  margin-left: 20px;
  font-size: 15px;
  border-radius: 10px;
  background-color: #d04e59;
  color: antiquewhite;
  :hover {
    cursor: pointer;
    box-shadow: 4px 4px grey;
  }
`;
const btnStyles = css`
  padding: 10px;
  border: none;
  width: 120px;
  border-radius: 10px;
  font-size: 15px;
  margin-left: 20px;
  background-color: #3ab8a9;
  color: #f3f8e6;
  :hover {
    cursor: pointer;
    box-shadow: 4px 4px grey;
  }
`;

type UserHier = {
  id: number;
  username: string;
};

type Props = {
  categoriesList: Category[];
  eventsss: Event[];
  user: UserHier;
  cloudinaryAPI: string | undefined;
};

export default function Admin(props: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventNameInput, setEventNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [image, setImage] = useState('');
  const [dateInput, setDateInput] = useState<string>();
  const [priceInput, setPriceInput] = useState(false);
  const [categoryIdInput, setCategoryIdInput] = useState(0);
  const [onEditId, setOnEditId] = useState<number>(0);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  // cloudinary part
  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'events_photo');

    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/${props.cloudinaryAPI}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();
    console.log('file url address', file.secure_url);

    setImage(file.secure_url);
  };

  // calling all events from the database
  async function getEventsFromApi() {
    setEvents(props.eventsss);
  }

  async function createEventFromApi() {
    if (onEditId > 0) {
      updateEventFromApiById();
    } else {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.user.id,
          image: image,
          eventName: eventNameInput,
          description: descriptionInput,
          address: addressInput,
          eventDate: dateInput,
          categoryId: categoryIdInput,
          free: priceInput,
        }),
      });

      const eventFromApi = (await response.json()) as Event;
      const newState = [...events, eventFromApi];

      setEvents(newState);
      clearStatus();
    }
  }

  async function deleteEventFromApiById(id: number) {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });
    const deletedEvent = (await response.json()) as Event;

    const filteredEvent = events.filter((event) => {
      return event.id !== deletedEvent.id;
    });

    setEvents(filteredEvent);
  }

  async function updateEventFromApiById() {
    const id = onEditId;
    const response = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        eventId: onEditId.toString(),
        image: image,
        eventName: eventNameInput,
        description: descriptionInput,
        address: addressInput,
        eventDate: dateInput,
        categoryId: categoryIdInput,
        free: priceInput,
      }),
    });
    const updatedEventFromApi = (await response.json()) as Event;

    const newState = events.map((event) => {
      if (event.id === updatedEventFromApi.id) {
        return updatedEventFromApi;
      } else {
        return event;
      }
    });
    clearStatus();
    setEvents(newState);
  }
  async function edit(id: number) {
    const e = events.find((e) => e.id === id);
    if (e) {
      setAddressInput(e.address);
      setEventNameInput(e.eventName);
      setImage(e.image);
      setDescriptionInput(e.description);
      setDateInput(e.eventDate.split('T')[0]);
      setCategoryIdInput(e.categoryId);
      setPriceInput(e.free);
      setOnEditId(e.id);
    } else {
      alert('event not found id: ' + id);
    }
  }

  function clearStatus() {
    setOnEditId(0);
    setAddressInput('');
    setEventNameInput('');
    setDescriptionInput('');
    setDateInput('');
    setImage('');
    setCategoryIdInput(0);
    setPriceInput(false);
  }

  useEffect(() => {
    getEventsFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Frontend event api</title>
        <meta name="description" content=" admin form " />
      </Head>
      <div
        css={css`
          margin-left: 10px;
          width: 40px;
          height: 40px;
          cursor: pointer;
        `}
      >
        {' '}
        <Link href="/private-profile">
          <ArrowLeftCircle />
        </Link>
      </div>
      <div css={flexStyles}>
        <div css={containerStyles}>
          <h1>Events Form</h1>
          <div>
            <input
              type="file"
              name="image"
              onChange={uploadImage}
              css={css`
                ::-webkit-file-upload-button {
                  background: #818080;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  padding: 5px;
                }
              `}
            />
            <div css={imgStyles}>
              <img
                src={image}
                width={200}
                height={200}
                alt=" format:Jpg / size:1mg"
              />
            </div>
          </div>

          <input
            placeholder="Event Name"
            value={eventNameInput}
            required
            onChange={(event) => {
              setEventNameInput(event.currentTarget.value);
            }}
          />

          <br />

          <br />
          <textarea
            placeholder="Description"
            required
            value={descriptionInput}
            onChange={(event) => {
              setDescriptionInput(event.currentTarget.value);
            }}
          />

          <br />

          <input
            placeholder="Location"
            required
            value={addressInput}
            onChange={(event) => {
              setAddressInput(event.currentTarget.value);
            }}
          />

          <br />
          <div>
            {' '}
            <input
              type="date"
              value={dateInput}
              required
              onChange={(event) => {
                setDateInput(event.currentTarget.value);
              }}
            />
            <label> Category: </label>
            <select
              required
              value={categoryIdInput}
              onChange={(event) => {
                setCategoryIdInput(Number(event.currentTarget.value));
              }}
            >
              <option>select one</option>
              {props.categoriesList?.map((category) => {
                return (
                  <option
                    value={category.id}
                    key={`categoriesList-${category.id}`}
                  >
                    {category.categoryName}
                  </option>
                );
              })}
            </select>
          </div>

          <br />
          <label>
            free
            <input
              type="checkbox"
              required
              checked={priceInput}
              onChange={(event) => {
                setPriceInput(Boolean(event.currentTarget.checked));
              }}
            />
          </label>
          <br />
          <div>
            {' '}
            <button
              css={btnStyles}
              onClick={async () => {
                await createEventFromApi();
              }}
            >
              submit
            </button>
            <button
              css={btn2Styles}
              onClick={() => {
                clearStatus();
              }}
            >
              clear
            </button>
          </div>

          <hr />
        </div>

        <div css={mapStyles}>
          <h2>Your created events</h2>
          <input
            placeholder="search your events"
            onChange={(e) => {
              if (filteredEvents.length <= 0) {
                setFilteredEvents(events);
              }

              if (e.currentTarget.value.length <= 0) {
                setEvents(filteredEvents);
              } else {
                const filteredEvent = events.filter((event) => {
                  return event.eventName.includes(e.currentTarget.value);
                });

                setEvents(filteredEvent);
              }
            }}
          />
          {events?.map((event) => {
            return (
              <div css={eventStyles} key={`eventId-${event.id}`}>
                <div>Event Name: {event.eventName} </div>
                <div>
                  <Link href={`/events/admin/${event.id}`}> more</Link>
                  <button
                    onClick={() => {
                      edit(event.id);
                    }}
                  >
                    edit
                  </button>
                  <a
                    onClick={async () => {
                      const result = confirm('Want to delete?');
                      if (result) {
                        await deleteEventFromApiById(event.id);
                      }
                    }}
                  >
                    <Delete
                      css={css`
                        width: 30px;
                        height: 40px;
                      `}
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));

  const cloudinaryAPI = process.env.CLOUDINARY_NAME;
  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/private-profile',
        permanent: false,
      },
    };
  }
  const eventsByLogedInUser = user && (await getEventByLogedInUser(user.id));

  const categoriesList = await getCategories();

  return {
    props: {
      categoriesList: categoriesList,
      eventsss: JSON.parse(JSON.stringify(eventsByLogedInUser)),
      user: user,
      cloudinaryAPI: cloudinaryAPI,
    },
  };
}
