'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '../../components/Navbar'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'

type Bookmark = {
    id: string
    title: string
    url: string
}

export default function Dashboard() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isSaving, setIsSaving] = useState(false)


    /* ---------------- FETCH ---------------- */

    const fetchBookmarks = async () => {
        const { data } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setBookmarks(data)
    }

    useEffect(() => {
        fetchBookmarks()

        const channel = supabase
            .channel('realtime-bookmarks')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookmarks' },
                () => fetchBookmarks()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const validateUrlServer = async (value: string) => {
        const res = await fetch('/api/validate-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: value }),
        })

        const data = await res.json()
        return data.valid
    }

    const isValidUrl = (value: string) => {
        try {
            new URL(value)
            return true
        } catch {
            return false
        }
    }



    /* ---------------- SAVE (ADD + EDIT) ---------------- */

    const saveBookmark = async () => {
        setErrorMsg('')

        if (!title || !url) {
            setErrorMsg('Title and URL are required')
            return
        }

        if (!isValidUrl(url)) {
            setErrorMsg('Invalid URL format')
            return
        }

        setIsSaving(true)

        // Soft validation (no blocking)
        const exists = await validateUrlServer(url)

        if (!exists) {
            setErrorMsg('Website may be unreachable, but you can still save it.')
        }

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('bookmarks')
                    .update({ title, url })
                    .eq('id', editingId)

                if (error) throw error

                setBookmarks((prev) =>
                    prev.map((b) =>
                        b.id === editingId ? { ...b, title, url } : b
                    )
                )

                setEditingId(null)
            } else {
                const { data, error } = await supabase
                    .from('bookmarks')
                    .insert([{ title, url }])
                    .select()

                if (error) throw error

                if (data) {
                    setBookmarks((prev) => [data[0], ...prev])
                }
            }

            setTitle('')
            setUrl('')
            setIsOpen(false)
        } catch {
            setErrorMsg('Something went wrong. Please try again.')
        }

        setIsSaving(false)
    }



    /* ---------------- DELETE ---------------- */

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id)

        if (!error) {
            setBookmarks((prev) => prev.filter((b) => b.id !== id))
        }
    }

    /* ---------------- OPEN ADD MODAL ---------------- */

    const openAddModal = () => {
        setEditingId(null)
        setTitle('')
        setUrl('')
        setIsOpen(true)
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />

            <section className="flex-1 px-12 py-12">
                <h2 className="text-3xl font-bold mb-10">Your Bookmarks</h2>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* ADD CARD */}
                    <div
                        onClick={openAddModal}
                        className="cursor-pointer border-2 border-dashed border-neutral-700 rounded-2xl flex items-center justify-center h-48 hover:border-yellow-500 transition"
                    >
                        <FaPlus className="text-4xl text-neutral-500 hover:text-yellow-500 transition" />
                    </div>

                    {/* BOOKMARK CARDS */}
                    {bookmarks.map((b) => (
                        <div
                            key={b.id}
                            className="bg-neutral-900 rounded-2xl p-5 flex flex-col justify-between h-48 hover:shadow-xl hover:shadow-yellow-500/10 transition"
                        >
                            <div>
                                <h3 className="font-semibold text-lg truncate">{b.title}</h3>
                                <a
                                    href={b.url}
                                    target="_blank"
                                    className="text-sm text-blue-400 break-words"
                                >
                                    {b.url}
                                </a>
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                <FaEdit
                                    onClick={() => {
                                        setEditingId(b.id)
                                        setTitle(b.title)
                                        setUrl(b.url)
                                        setIsOpen(true)
                                    }}
                                    className="cursor-pointer hover:text-yellow-500 transition"
                                />

                                <FaTrash
                                    onClick={() => deleteBookmark(b.id)}
                                    className="cursor-pointer hover:text-red-500 transition"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-md space-y-5">

                        <h3 className="text-xl font-bold">
                            {editingId ? 'Edit Bookmark' : 'Add Bookmark'}
                        </h3>

                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-3 rounded bg-neutral-800"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="URL"
                            className="w-full p-3 rounded bg-neutral-800"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        {/* ✅ ERROR MESSAGE */}
                        {errorMsg && (
                            <p className="text-red-500 text-sm">{errorMsg}</p>
                        )}

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setEditingId(null)
                                    setTitle('')
                                    setUrl('')
                                    setErrorMsg('')
                                }}
                                className="px-5 py-2 rounded-xl border border-neutral-600 hover:border-white transition"
                            >
                                Discard
                            </button>

                            {/* ✅ UPDATED SAVE BUTTON */}
                            <button
                                onClick={saveBookmark}
                                disabled={isSaving}
                                className="px-5 py-2 rounded-xl bg-white text-black font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
                            >
                                {isSaving
                                    ? 'Validating...'
                                    : editingId
                                        ? 'Update'
                                        : 'Save'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </main>
    )

}
