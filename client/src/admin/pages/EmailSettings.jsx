import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

import AdminLayout from "../AdminLayout";
import "../css/HomeSettings.css";

const API_URL =
    "http://localhost:5000/api/admin/email-settings";

const EmailSettings = () => {

    const [settings, setSettings] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

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
                "FETCH EMAIL SETTINGS ERROR:",
                err
            );

            toast.error(
                "Failed to load email settings."
            );

        } finally {

            setLoading(false);

        }

    };

    const toggleEnabled = async () => {

        if (!settings) return;

        const nextValue = !settings.enabled;

        try {

            setSaving(true);

            const token =
                localStorage.getItem("token");

            const { data } =
                await axios.put(
                    API_URL,
                    { enabled: nextValue },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            setSettings(data.settings);

            toast.success(
                data.message ||
                    "Email settings updated."
            );

        } catch (err) {

            console.error(
                "UPDATE EMAIL SETTINGS ERROR:",
                err
            );

            toast.error(
                "Failed to update email settings."
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (
            <AdminLayout>
                <h2>Loading Email Settings...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

            <div className="home-settings-page">

                <h1 className="home-settings-title">
                    Email Notifications
                </h1>

                <p className="home-settings-subtitle">
                    Control whether order emails
                    (confirmation, status updates,
                    and admin alerts) are sent
                    through Brevo. Turning this off
                    stops all order-related emails
                    instantly, without touching any
                    code or server configuration.
                </p>

                <div className="home-settings-list">

                    <div className="home-settings-row">

                        <div className="home-settings-row-text">
                            <h3>
                                <Mail
                                    size={16}
                                    style={{
                                        verticalAlign:
                                            "-3px",
                                        marginRight: 6,
                                    }}
                                />
                                Order Emails
                            </h3>
                            <p>
                                Sends an order
                                confirmation to the
                                customer when an
                                order is placed, a
                                status update email
                                on every status
                                change, and an admin
                                alert to the
                                notification inbox
                                when an order is
                                confirmed.
                            </p>
                        </div>

                        <label className="visibility-switch">

                            <input
                                type="checkbox"
                                checked={
                                    settings?.enabled !==
                                    false
                                }
                                disabled={saving}
                                onChange={
                                    toggleEnabled
                                }
                            />

                            <span className="visibility-switch-track" />

                        </label>

                    </div>

                </div>

            </div>

        </AdminLayout>

    );

};

export default EmailSettings;
