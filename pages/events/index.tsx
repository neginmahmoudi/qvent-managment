import { PersonCircle } from '@emotion-icons/bootstrap';
import { css } from '@emotion/react';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { Category, getCategories } from '../../database/categories';
import { EventDTO, getEventsWithJoint } from '../../database/events';

const hStyles = css`
  margin-left: 30px;
`;
const wrapstyles = css`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-family: cursive;
`;
const hoverStyles = css`
  margin-left: 60px;
  font-family: monospace;
`;
const containerStyles = css`
  border-radius: 10px;
  border: 1px solid #aeccc6;
  padding: 30px;
  display: flex;
  align-items: flex-start;
  background-color: #d2ecbe;
  flex-direction: column;
  width: 300px;
  margin: 2rem;
  margin-top: 55px;
  a {
    text-decoration: none;
    color: black;
  }
  :hover {
    cursor: pointer;
    box-shadow: 4px -4px #aeccc6;
    transform: scaleY(0.98);
  }
`;

const wStyles = css`
  background-color: #bbe9db;
  margin-left: 20px;
  padding: 10px;
  display: flex;
  margin: 0 auto;
  border-radius: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  div:nth-child(4) {
    color: red;
  }
`;
const imgStyles = css`
  border-radius: 3px;
  margin-left: 10px;
  margin: 0 auto;
`;
const followerStyles = css`
  margin-left: 110px;
  font-weight: bold;
  font-size: 15px;
`;
const iconStyles = css`
  width: 17px;
  height: 17px;
`;

type Props = {
  filteredEvents: EventDTO[];
  categoryList: Category[];
};
export default function EventFromDataBase(props: Props) {
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState(props.filteredEvents);
  return (
    <div>
      <Head>
        <title>list of events</title>
        <meta name="description" content="List of events in qvent app" />
      </Head>
      <select
        required={true}
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(Number(e.currentTarget.value));
          if (Number(e.currentTarget.value) !== 0) {
            const filteredEvent = props.filteredEvents.filter((event) => {
              return event.categoryId === Number(e.currentTarget.value);
            });
            setFilteredEvents(filteredEvent);
          }
        }}
      >
        <option value={0}>select your favorite category</option>
        {props.categoryList?.map((category) => {
          return (
            <option value={category.id} key={`categoriesList-${category.id}`}>
              {category.categoryName}
            </option>
          );
        })}
      </select>
      <h1 css={hStyles}>all events</h1>
      <p css={hoverStyles}>To find out more click on your favorite event !</p>
      <div css={wrapstyles}>
        {filteredEvents?.map((event) => {
          return (
            <div key={`events-${event.id}`} css={containerStyles}>
              <a href={`events/${event.id}`}>
                <div css={imgStyles}>
                  <Image
                    src="/showcart.jpeg"
                    alt="logo of the site"
                    width="240px"
                    height="200px"
                  />
                </div>

                <div css={wStyles}>
                  <h3>name: {event.eventName}</h3>
                  <div>location: {event.address}</div>
                  <div>host:{event.username}</div>
                  <div>{event.free ? 'free' : ''}</div>
                  <div>{event.eventDate.split('T')[0]}</div>
                  <div>{event.categoryName}</div>
                  <div css={followerStyles}>
                    followers <PersonCircle css={iconStyles} />
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  const eventsList = await getEventsWithJoint();
  const categoryList = await getCategories();
  return {
    props: {
      filteredEvents: JSON.parse(JSON.stringify(eventsList)),
      categoryList: categoryList,
    },
  };
}
