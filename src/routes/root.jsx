import React, { useEffect,useState } from "react";
import { Link, Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import styles from '../index.css'



let fakeCache = {};

// Определение фиктивной функции fakeNetwork
async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const filter = url.searchParams.get("filter"); // Добавляем параметр filter
  const contacts = await getContacts(q, filter); // Передаем filter в функцию getContacts
  return { contacts, q, filter };
}

export async function fetchContacts(query, filter) {
  await fakeNetwork(`fetchContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];

  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }

  if (filter === "favorites") {
    contacts = contacts.filter((contact) => contact.favorite);
  } else if (filter === "non-favorites") {
    contacts = contacts.filter((contact) => !contact.favorite);
  }

  return contacts.sort(sortBy("last", "createdAt"));
}

export async function action() {
  const contact = await createContact();
  // return { contact };
  return redirect(`/contacts/${contact.id}/edit`);
}

function Root() {
  const [view, setView] = useState("all");
  
  const { contacts, q, filter } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  const getContacts =()=> {
    switch (view) {
      case 'favorite':
        return contacts.filter(item => item.favorite)
      case 'nonfavorite':
        return contacts.filter (item=> !item.favorite)
      default : return contacts;
    }
  }

  console.log(contacts)
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
          {/* <Form method="post" action="/contacts" data-fetch={true}> */}
            <div id={styles.mar}>
            <button onClick={()=> setView('favorite')} type="submit" name="filter" value="favorites">
             Favorites
            </button>
            <button onClick={()=> setView('nonfavorite')} type="submit" name="filter" value="non-favorites">
              Non-Favorites
            </button>
            <button onClick={()=> setView('all')} type="submit" name="filter" value="all">
              All
            </button>

              </div>
          {/* </Form> */}
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {getContacts().map((contact) => (
                <Link to={`contacts/${contact.id}`} key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </Link>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}

export default Root;