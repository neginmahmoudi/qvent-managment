import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Event } from '../../database/events';

export default function Admin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventNameInput, setEventNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [priceInput, setPriceInput] = useState('false');

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
      body: JSON.stringify({}),
    });
    const eventFromApi = (await response.json()) as Event;

    // you can check if animalFromApi contains an error and display the error in the front end

    const newState = [...events, eventFromApi];

    setEvents(newState);
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

  useEffect(() => {
    getEventsFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Frontend api</title>
        <meta name="description" content="Content of the api " />
      </Head>

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

      <select name="categories" id="categories">
        <option value="volvo">Volvo</option>
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

      {events.map((event) => {
        return (
          <div key={event.id}>
            <div>{event.userId}</div>
            <div>{event.eventName}</div>
            <div>{event.description}</div>
            <div>{event.address}</div>
            <div>{event.eventDate.toString()}</div>
            <div>{event.categoryId}</div>
            <div>{event.isFree}</div>
            <button>edit</button>
            <button>save</button>
            <button
              onClick={async () => await deleteEventFromApiById(event.id)}
            >
              {' '}
              delete
            </button>
          </div>
        );
      })}
    </>
  );
}
