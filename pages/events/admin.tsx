import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Category, getCategories } from '../../database/categories';
import { Event } from '../../database/events';

type Props = {
  categoriesList: Category[];
};
export default function Admin(props: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventNameInput, setEventNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [priceInput, setPriceInput] = useState('false');
  const [categoryIdInput, setCategoryIdInput] = useState(0);

  const [eventNameOnEditInput, seteventNameOnEditInput] = useState('');
  const [descriptionOnEditInput, setDescriptionOnEditInput] = useState('');
  const [addressOnEditInput, setAddressOnEditInput] = useState('');
  const [dateOnEditInput, setDateOnEditInput] = useState('');
  const [priceOnEditInput, setPriceOnEditInput] = useState(false);
  const [onEditId, setOnEditId] = useState<number | undefined>();

  async function getEventsFromApi() {
    const response = await fetch('/api/events');
    const eventsFromApi = await response.json();

    setEvents(eventsFromApi);
  }

  async function createEventFromApi() {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.user.id,
        eventName: eventNameInput,
        description: descriptionInput,
        address: addressInput,
        eventDate: dateInput,
        categoryId: categoryIdInput,
        isFree: priceInput,
      }),
    });
    const eventFromApi = (await response.json()) as Event;

    // const newState = [...events, eventFromApi];

    // setEvents(newState);
    getEventsFromApi();
  }

  async function deleteEventFromApiById(id: number) {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });
    const deletedEvent = (await response.json()) as Event;

    const filteredEvent = events.filter((event) => {
      return event.id !== deletedEvent.id;
    });

    // setEvents(filteredEvent);
    getEventsFromApi();
  }

  async function updateEventFromApiById(id: number) {
    const response = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        eventName: eventNameOnEditInput,
        description: descriptionOnEditInput,
        address: addressOnEditInput,
        eventDate: dateOnEditInput,
        categoryName: props.categoriesList,
        isFree: priceOnEditInput,
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

    setEvents(newState);
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
        <meta name="description" content="Content of the api " />
      </Head>
      <div>
        <h1>Events Form</h1>
        <label>
          event Name
          <input
            value={eventNameInput}
            onChange={(event) => {
              setEventNameInput(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          description
          <br />
          <textarea
            value={descriptionInput}
            onChange={(event) => {
              setDescriptionInput(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          Address
          <input
            value={addressInput}
            onChange={(event) => {
              setAddressInput(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          date
          <input
            type="date"
            value={dateInput}
            onChange={(event) => {
              setDateInput(event.currentTarget.value);
            }}
          />
        </label>
        <label>Choose a Category:</label>
        <select
          required={true}
          onChange={(event) => {
            console.log(event.currentTarget.value);
            setCategoryIdInput(event.currentTarget.value);
          }}
        >
          <option>select one</option>
          {props.categoriesList?.map((category) => {
            return (
              <option value={category.id} key={`categoriesList-${category.id}`}>
                {category.categoryName}
              </option>
            );
          })}
        </select>
        <br />
        <label>
          free
          <input
            type="checkbox"
            value={priceInput}
            onChange={(event) => {
              setPriceInput(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <button
          onClick={async () => {
            await createEventFromApi();
          }}
        >
          submit
        </button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>event Id</th>
              <th>event name</th>
              <th>event description</th>

              <th>event address</th>
              <th>event date</th>
              <th>event category name</th>
              <th>event price</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event) => {
              return (
                <tr key={`eventId-${event.userId}`}>
                  <td>{event.userId}</td>
                  <td>{event.eventName}</td>
                  <td>{event.description}</td>
                  <td>{event.address}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.categoryId}</td>
                  <td>{event.isFree}</td>
                  <td>
                    {' '}
                    <button>edit</button>
                    <button>save</button>
                    <button
                      onClick={async () =>
                        await deleteEventFromApiById(event.id)
                      }
                    >
                      {' '}
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* {events.map((event) => {
        const isEventOnEdit = onEditId === animal.id;

        return (
          <Fragment key={event.id}>
            <input
              value={isEventOnEdit ? eventNameOnEditInput : event.eventName}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                setEventNameOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={isEventOnEdit ? descriptionOnEditInput : event.description}
              disabled={!isAnimalOnEdit}
              onChange={(event) => {
                setTypeOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={
                isAnimalOnEdit ? accessoryOnEditInput : animal.accessory || ''
              }
              disabled={!isAnimalOnEdit}
              onChange={(event) => {
                setAccessoryOnEditInput(event.currentTarget.value);
              }}
            />

            <button onClick={() => deleteAnimalFromApiById(animal.id)}>
              X
            </button>
            {!isAnimalOnEdit ? (
              <button
                onClick={() => {
                  setOnEditId(animal.id);
                  setFirstNameOnEditInput(animal.firstName);
                  setAccessoryOnEditInput(animal.accessory || '');
                  setTypeOnEditInput(animal.type);
                }}
              >
                edit
              </button>
            ) : (
              <button
                onClick={async () => {
                  setOnEditId(undefined);
                  await updateAnimalFromApiById(animal.id);
                }}
              >
                save
              </button>
            )}
            <br />
          </Fragment>
        );
      })} */}
    </>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  const categoriesList = await getCategories();
  return {
    props: {
      categoriesList: categoriesList,
    },
  };
}
