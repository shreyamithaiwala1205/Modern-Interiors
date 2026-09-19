import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";
import "../css/HomeSettings.css";

const API_URL =
    "http://localhost:5000/api/admin/home-settings";

const SECTIONS = [
    {
        key: "trendingProducts",
        label: "Trending Products",
        description:
            "Products tagged as Trending, shown right below Services.",
    },
    {
        key: "services",
        label: "Services",
        description:
            "The list of services Modern Interiors offers.",
    },
    {
        key: "designJourney",
        label: "Design Journey",
        description:
            "The animated step-by-step process timeline.",
    },
    {
        key: "projects",
        label: "Featured Projects",
        description:
            "A preview of featured interior design projects.",
    },
    {
        key: "beforeAfter",
        label: "Before & After",
        description:
            "The interactive before/after transformation slider.",
    },
    {
        key: "whyChoose",
        label: "Why Choose Us",
        description:
            "Highlights of what makes Modern Interiors different.",
    },
    {
        key: "stats",
        label: "Statistics",
        description:
            "Company stats such as projects completed and clients served.",
    },
    {
        key: "team",
        label: "Our Team",
        description: "Team member showcase section.",
    },
    {
        key: "testimonials",
        label: "Testimonials",
        description: "Client testimonials and reviews.",
    },
];

const HomeSettings = () => {

    const [settings, setSettings] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [savingKey, setSavingKey] =
        useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const { data } =
                await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            setSettings(data.settings);

        } catch (err) {

            console.error(
                "FETCH HOME SETTINGS ERROR:",
                err
            );

            toast.error(
                "Failed to load home page settings."
            );

        } finally {

            setLoading(false);

        }

    };

    const toggleSection = async (key) => {

        if (!settings) return;

        const nextValue = !settings[key];

        try {

            setSavingKey(key);

            const token =
                localStorage.getItem("token");

            const { data } =
                await axios.put(
                    API_URL,
                    { [key]: nextValue },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            setSettings(data.settings);

            toast.success(
                `${
                    SECTIONS.find(
                        (s) => s.key === key
                    )?.label
                } is now ${
                    nextValue ? "visible" : "hidden"
                } on the home page.`
            );

        } catch (err) {

            console.error(
                "UPDATE HOME SETTINGS ERROR:",
                err
            );

            toast.error(
                "Failed to update section visibility."
            );

        } finally {

            setSavingKey(null);

        }

    };

    if (loading) {

        return (
            <AdminLayout>
                <h2>Loading Home Page Settings...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

            <div className="home-settings-page">

                <h1 className="home-settings-title">
                    Home Page Sections
                </h1>

                <p className="home-settings-subtitle">
                    Turn sections on or off to control
                    what visitors see on the public
                    home page — changes apply instantly.
                </p>

                <div className="home-settings-list">

                    {SECTIONS.map((section) => (

                        <div
                            className="home-settings-row"
                            key={section.key}
                        >

                            <div className="home-settings-row-text">
                                <h3>
                                    {section.label}
                                </h3>
                                <p>
                                    {section.description}
                                </p>
                            </div>

                            <label className="visibility-switch">

                                <input
                                    type="checkbox"
                                    checked={
                                        settings?.[
                                            section.key
                                        ] !== false
                                    }
                                    disabled={
                                        savingKey ===
                                        section.key
                                    }
                                    onChange={() =>
                                        toggleSection(
                                            section.key
                                        )
                                    }
                                />

                                <span className="visibility-switch-track" />

                            </label>

                        </div>

                    ))}

                </div>

            </div>

        </AdminLayout>

    );

};

export default HomeSettings;
