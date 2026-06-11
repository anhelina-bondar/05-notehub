import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import css from "./App.module.css";

import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";

import { fetchNotes } from "../../services/noteService";

import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import { createNote } from "../../services/noteService";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
        exact: false,
      });
      setIsModalOpen(false);
    },
  });
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button
          type="button"
          className={css.button}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Something went wrong...</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data && data.notes.length === 0 && !isLoading && <p>No notes found</p>}

      {isModalOpen && (
        <>
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm
              onCancel={() => setIsModalOpen(false)}
              onSubmit={(values) => createMutation.mutate(values)}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
