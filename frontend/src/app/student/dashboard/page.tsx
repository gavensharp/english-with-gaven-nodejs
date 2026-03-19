"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getToken, removeToken, fetchWithAuth } from "@/lib/auth";
import { getMyLessons, cancelLesson, Lesson } from "@/services/lessonService";
import InfoButton from "@/components/InfoButton";
import SaveCancelButtons from "@/components/SaveCancelButtons";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_photo?: string;
  dob?: string;
  country?: string;
  english_level?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lesson states
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  // Form states
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    dob: "",
    country: "",
    gender: "",
    timezone: "",
  });
  const [englishLevel, setEnglishLevel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [levelUpdateStatus, setLevelUpdateStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [photoUploadStatus, setPhotoUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!levelUpdateStatus) return;

    const timeout = setTimeout(() => {
      setLevelUpdateStatus(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [levelUpdateStatus]);

  useEffect(() => {
    if (!profileUpdateStatus) return;

    const timeout = setTimeout(() => {
      setProfileUpdateStatus(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [profileUpdateStatus]);

  useEffect(() => {
    if (!photoUploadStatus) return;

    const timeout = setTimeout(() => {
      setPhotoUploadStatus(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [photoUploadStatus]);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetchWithAuth("/api/users/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUser(data.user);
        // 👇 Auto-detect timezone if not set
        const detectedTimezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        const userTimezone = data.user.timezone || detectedTimezone;
        setProfileData({
          name: data.user.name || "",
          dob: data.user.dob || "",
          country: data.user.country || "",
          gender: data.user.gender || "",
          timezone: userTimezone || "",
        });
        setEnglishLevel(data.user.english_level || "");
        // 👇 Auto-save timezone if it was just detected
        if (!data.user.timezone) {
          autoSaveTimezone(userTimezone);
        }
      } catch (err) {
        setError("Failed to load profile");
        removeToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Fetch lessons
  useEffect(() => {
    if (user) {
      fetchMyLessons();

      // Refresh lessons every 30 seconds to check for upcoming lessons
      const interval = setInterval(() => {
        fetchMyLessons();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMyLessons = async () => {
    try {
      setLoadingLessons(true);
      const token = getToken();
      if (!token) return;

      const myLessons = await getMyLessons(token);

      // Sort by start time, upcoming first
      const sortedLessons = myLessons.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );

      setLessons(sortedLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleCancelLesson = async (lessonId: number) => {
    if (!confirm("Are you sure you want to cancel this lesson?")) {
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      const result = await cancelLesson(lessonId, token);
      alert(result.message || "Lesson cancelled successfully!");
      fetchMyLessons(); // Refresh list
    } catch (error: any) {
      alert(error.message || "Failed to cancel lesson");
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  // Update profile (name, dob, country)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileUpdateStatus(null);

    try {
      const response = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const data = await response.json();
      setUser(data.user);
      setEditMode(false);
      setProfileUpdateStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (err) {
      setProfileUpdateStatus({
        type: "error",
        message: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  // Update English level
  const handleLevelUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLevelUpdateStatus(null);

    try {
      const response = await fetchWithAuth("/api/users/english-level", {
        method: "PUT",
        body: JSON.stringify({ english_level: englishLevel }),
      });

      if (!response.ok) throw new Error("Failed to update level");

      await response.json();
      setUser((prev) =>
        prev ? { ...prev, english_level: englishLevel } : null,
      );
      setLevelUpdateStatus({
        type: "success",
        message: "English level updated!",
      });
    } catch (err) {
      setLevelUpdateStatus({
        type: "error",
        message: "Failed to update English level",
      });
    }
  };

  // Auto-save detected timezone
  const autoSaveTimezone = async (timezone: string) => {
    try {
      await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({ timezone }),
      });
    } catch (err) {
      console.error("Failed to auto-save timezone:", err);
    }
  };

  // Photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploadStatus(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      setPhotoUploadStatus({
        type: "error",
        message: "Please select an image file",
      });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      setPhotoUploadStatus({
        type: "error",
        message: "File size must be less than 2MB",
      });
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const token = getToken();

      const response = await fetch("/api/users/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user state with new photo
        setUser((prev) =>
          prev ? { ...prev, profile_photo: data.filename } : null,
        );
        setError("");
        setPhotoUploadStatus({
          type: "success",
          message: "Photo uploaded successfully!",
        });
      } else {
        setError(data.error || "Failed to upload photo");
        setPhotoUploadStatus({
          type: "error",
          message: data.error || "Failed to upload photo",
        });
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Failed to upload photo");
      setPhotoUploadStatus({
        type: "error",
        message: "Failed to upload photo",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  // Filter for upcoming lessons (scheduled and not yet ended)
  const now = new Date();
  const TEN_MINUTES_MS = 10 * 60 * 1000;

  console.log("Student Dashboard - Filtering lessons:", {
    totalLessons: lessons.length,
    currentTime: now.toISOString(),
    lessons: lessons.map((l) => ({
      id: l.id,
      status: l.status,
      startTime: l.startTime,
      endTime: l.endTime,
    })),
  });

  // Show all upcoming lessons (not cancelled and end time is in the future)
  const upcomingLessons = lessons.filter((lesson) => {
    const endTime = new Date(lesson.endTime);
    const isUpcoming = lesson.status !== "cancelled" && endTime > now;

    console.log(`Lesson ${lesson.id}:`, {
      status: lesson.status,
      startTime: lesson.startTime,
      endTime: endTime.toISOString(),
      now: now.toISOString(),
      notCancelled: lesson.status !== "cancelled",
      endInFuture: endTime > now,
      isUpcoming,
    });

    return isUpcoming;
  });

  console.log("Upcoming lessons found:", upcomingLessons.length);

  // Sort by start time (earliest first)
  upcomingLessons.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  // Determine which lessons can be joined (within 10 minutes or in progress)
  const joinableLessons = upcomingLessons.filter((lesson) => {
    const startTime = new Date(lesson.startTime);
    const endTime = new Date(lesson.endTime);
    const earlyAccessTime = new Date(startTime.getTime() - TEN_MINUTES_MS);
    return now >= earlyAccessTime && now <= endTime;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">
            Your Dashboard
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

              {/* Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  {user.profile_photo &&
                  user.profile_photo !== "default-photo.jpg" ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/uploads/profile_photo/${user.profile_photo}`}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover border-4 border-border"
                      unoptimized
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-5xl font-bold border-4 border-gray-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="btn btn-outline-secondary cursor-pointer text-sm">
                  {uploading ? "Uploading..." : "Change Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {photoUploadStatus && (
                  <div
                    className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm font-medium ${
                      photoUploadStatus.type === "success"
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}>
                    {photoUploadStatus.message}
                  </div>
                )}
              </div>

              {/* View/Edit Profile */}
              {!editMode ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  {user.dob && (
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-semibold">
                        {new Date(user.dob).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {user.country && (
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-semibold">{user.country}</p>
                    </div>
                  )}
                  {profileData.gender && (
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-semibold capitalize">
                        {profileData.gender}
                      </p>
                    </div>
                  )}
                  {profileData.timezone && (
                    <div>
                      <p className="text-sm text-gray-500">Timezone</p>
                      <p className="font-semibold">{profileData.timezone}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-outline-secondary w-full mt-4">
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileData.dob}
                      onChange={(e) =>
                        setProfileData({ ...profileData, dob: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={profileData.country}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg">
                      <option value="">Select Country</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Andorra">Andorra</option>
                      <option value="Angola">Angola</option>
                      <option value="Antigua and Barbuda">
                        Antigua and Barbuda
                      </option>
                      <option value="Argentina">Argentina</option>
                      <option value="Armenia">Armenia</option>
                      <option value="Australia">Australia</option>
                      <option value="Austria">Austria</option>
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="Bahamas">Bahamas</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Barbados">Barbados</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Belize">Belize</option>
                      <option value="Benin">Benin</option>
                      <option value="Bhutan">Bhutan</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Bosnia and Herzegovina">
                        Bosnia and Herzegovina
                      </option>
                      <option value="Botswana">Botswana</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Brunei">Brunei</option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Cabo Verde">Cabo Verde</option>
                      <option value="Cambodia">Cambodia</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Canada">Canada</option>
                      <option value="Central African Republic">
                        Central African Republic
                      </option>
                      <option value="Chad">Chad</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Comoros">Comoros</option>
                      <option value="Congo">Congo</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Croatia">Croatia</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Djibouti">Djibouti</option>
                      <option value="Dominica">Dominica</option>
                      <option value="Dominican Republic">
                        Dominican Republic
                      </option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Egypt">Egypt</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Equatorial Guinea">
                        Equatorial Guinea
                      </option>
                      <option value="Eritrea">Eritrea</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Eswatini">Eswatini</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Fiji">Fiji</option>
                      <option value="Finland">Finland</option>
                      <option value="France">France</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Gambia">Gambia</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Germany">Germany</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Greece">Greece</option>
                      <option value="Grenada">Grenada</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Guinea-Bissau">Guinea-Bissau</option>
                      <option value="Guyana">Guyana</option>
                      <option value="Haiti">Haiti</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Hungary">Hungary</option>
                      <option value="Iceland">Iceland</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Iran">Iran</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Israel">Israel</option>
                      <option value="Italy">Italy</option>
                      <option value="Jamaica">Jamaica</option>
                      <option value="Japan">Japan</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Kiribati">Kiribati</option>
                      <option value="Kosovo">Kosovo</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Kyrgyzstan">Kyrgyzstan</option>
                      <option value="Laos">Laos</option>
                      <option value="Latvia">Latvia</option>
                      <option value="Lebanon">Lebanon</option>
                      <option value="Lesotho">Lesotho</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Libya">Libya</option>
                      <option value="Liechtenstein">Liechtenstein</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Malawi">Malawi</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Maldives">Maldives</option>
                      <option value="Mali">Mali</option>
                      <option value="Malta">Malta</option>
                      <option value="Marshall Islands">Marshall Islands</option>
                      <option value="Mauritania">Mauritania</option>
                      <option value="Mauritius">Mauritius</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Micronesia">Micronesia</option>
                      <option value="Moldova">Moldova</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Mongolia">Mongolia</option>
                      <option value="Montenegro">Montenegro</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Nauru">Nauru</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Niger">Niger</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="North Korea">North Korea</option>
                      <option value="North Macedonia">North Macedonia</option>
                      <option value="Norway">Norway</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Palau">Palau</option>
                      <option value="Palestine">Palestine</option>
                      <option value="Panama">Panama</option>
                      <option value="Papua New Guinea">Papua New Guinea</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Peru">Peru</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Poland">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Romania">Romania</option>
                      <option value="Russia">Russia</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Saint Kitts and Nevis">
                        Saint Kitts and Nevis
                      </option>
                      <option value="Saint Lucia">Saint Lucia</option>
                      <option value="Saint Vincent and the Grenadines">
                        Saint Vincent and the Grenadines
                      </option>
                      <option value="Samoa">Samoa</option>
                      <option value="San Marino">San Marino</option>
                      <option value="Sao Tome and Principe">
                        Sao Tome and Principe
                      </option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Seychelles">Seychelles</option>
                      <option value="Sierra Leone">Sierra Leone</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Slovakia">Slovakia</option>
                      <option value="Slovenia">Slovenia</option>
                      <option value="Solomon Islands">Solomon Islands</option>
                      <option value="Somalia">Somalia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="South Korea">South Korea</option>
                      <option value="South Sudan">South Sudan</option>
                      <option value="Spain">Spain</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Sudan">Sudan</option>
                      <option value="Suriname">Suriname</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Syria">Syria</option>
                      <option value="Taiwan">Taiwan</option>
                      <option value="Tajikistan">Tajikistan</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Timor-Leste">Timor-Leste</option>
                      <option value="Togo">Togo</option>
                      <option value="Tonga">Tonga</option>
                      <option value="Trinidad and Tobago">
                        Trinidad and Tobago
                      </option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Turkmenistan">Turkmenistan</option>
                      <option value="Tuvalu">Tuvalu</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates
                      </option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Vanuatu">Vanuatu</option>
                      <option value="Vatican City">Vatican City</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Yemen">Yemen</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          gender: e.target.value,
                        })
                      }
                      className="input w-full">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Timezone
                      <span className="text-xs text-gray-500 ml-2">
                        (Auto-detected:{" "}
                        {Intl.DateTimeFormat().resolvedOptions().timeZone})
                      </span>
                    </label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          timezone: e.target.value,
                        })
                      }
                      className="input w-full">
                      <option value="UTC">
                        UTC (Coordinated Universal Time)
                      </option>

                      <optgroup label="North America">
                        <option value="America/New_York">
                          Eastern Time (US & Canada)
                        </option>
                        <option value="America/Chicago">
                          Central Time (US & Canada)
                        </option>
                        <option value="America/Denver">
                          Mountain Time (US & Canada)
                        </option>
                        <option value="America/Phoenix">
                          Arizona (No DST)
                        </option>
                        <option value="America/Los_Angeles">
                          Pacific Time (US & Canada)
                        </option>
                        <option value="America/Anchorage">Alaska</option>
                        <option value="Pacific/Honolulu">Hawaii</option>
                        <option value="America/Toronto">Toronto</option>
                        <option value="America/Vancouver">Vancouver</option>
                        <option value="America/Halifax">Halifax</option>
                        <option value="America/St_Johns">Newfoundland</option>
                        <option value="America/Mexico_City">Mexico City</option>
                        <option value="America/Cancun">Cancun</option>
                      </optgroup>

                      <optgroup label="Central & South America">
                        <option value="America/Bogota">Bogota</option>
                        <option value="America/Lima">Lima</option>
                        <option value="America/Santiago">Santiago</option>
                        <option value="America/Buenos_Aires">
                          Buenos Aires
                        </option>
                        <option value="America/Sao_Paulo">São Paulo</option>
                        <option value="America/Rio_Branco">Rio Branco</option>
                        <option value="America/Caracas">Caracas</option>
                        <option value="America/La_Paz">La Paz</option>
                        <option value="America/Montevideo">Montevideo</option>
                        <option value="America/Asuncion">Asunción</option>
                      </optgroup>

                      <optgroup label="Europe">
                        <option value="Europe/London">London (GMT/BST)</option>
                        <option value="Europe/Dublin">Dublin</option>
                        <option value="Europe/Lisbon">Lisbon</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Europe/Berlin">Berlin</option>
                        <option value="Europe/Madrid">Madrid</option>
                        <option value="Europe/Rome">Rome</option>
                        <option value="Europe/Amsterdam">Amsterdam</option>
                        <option value="Europe/Brussels">Brussels</option>
                        <option value="Europe/Vienna">Vienna</option>
                        <option value="Europe/Stockholm">Stockholm</option>
                        <option value="Europe/Copenhagen">Copenhagen</option>
                        <option value="Europe/Oslo">Oslo</option>
                        <option value="Europe/Helsinki">Helsinki</option>
                        <option value="Europe/Warsaw">Warsaw</option>
                        <option value="Europe/Prague">Prague</option>
                        <option value="Europe/Budapest">Budapest</option>
                        <option value="Europe/Athens">Athens</option>
                        <option value="Europe/Bucharest">Bucharest</option>
                        <option value="Europe/Sofia">Sofia</option>
                        <option value="Europe/Istanbul">Istanbul</option>
                        <option value="Europe/Kiev">Kyiv</option>
                        <option value="Europe/Moscow">Moscow</option>
                        <option value="Europe/Zurich">Zurich</option>
                      </optgroup>

                      <optgroup label="Africa">
                        <option value="Africa/Cairo">Cairo</option>
                        <option value="Africa/Johannesburg">
                          Johannesburg
                        </option>
                        <option value="Africa/Lagos">Lagos</option>
                        <option value="Africa/Nairobi">Nairobi</option>
                        <option value="Africa/Casablanca">Casablanca</option>
                        <option value="Africa/Algiers">Algiers</option>
                        <option value="Africa/Tunis">Tunis</option>
                        <option value="Africa/Accra">Accra</option>
                        <option value="Africa/Addis_Ababa">Addis Ababa</option>
                        <option value="Africa/Dar_es_Salaam">
                          Dar es Salaam
                        </option>
                      </optgroup>

                      <optgroup label="Middle East">
                        <option value="Asia/Dubai">Dubai (UAE)</option>
                        <option value="Asia/Riyadh">Riyadh</option>
                        <option value="Asia/Kuwait">Kuwait</option>
                        <option value="Asia/Doha">Doha</option>
                        <option value="Asia/Bahrain">Bahrain</option>
                        <option value="Asia/Muscat">Muscat</option>
                        <option value="Asia/Tehran">Tehran</option>
                        <option value="Asia/Jerusalem">Jerusalem</option>
                        <option value="Asia/Beirut">Beirut</option>
                        <option value="Asia/Amman">Amman</option>
                        <option value="Asia/Damascus">Damascus</option>
                        <option value="Asia/Baghdad">Baghdad</option>
                      </optgroup>

                      <optgroup label="Asia">
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="Asia/Karachi">Karachi</option>
                        <option value="Asia/Dhaka">Dhaka</option>
                        <option value="Asia/Kathmandu">Kathmandu</option>
                        <option value="Asia/Colombo">Colombo</option>
                        <option value="Asia/Shanghai">
                          China (Beijing, Shanghai)
                        </option>
                        <option value="Asia/Hong_Kong">Hong Kong</option>
                        <option value="Asia/Taipei">Taipei</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Seoul">Seoul</option>
                        <option value="Asia/Singapore">Singapore</option>
                        <option value="Asia/Kuala_Lumpur">Kuala Lumpur</option>
                        <option value="Asia/Manila">Manila</option>
                        <option value="Asia/Bangkok">Bangkok</option>
                        <option value="Asia/Jakarta">Jakarta</option>
                        <option value="Asia/Ho_Chi_Minh">
                          Ho Chi Minh City
                        </option>
                        <option value="Asia/Yangon">Yangon</option>
                        <option value="Asia/Phnom_Penh">Phnom Penh</option>
                        <option value="Asia/Vientiane">Vientiane</option>
                        <option value="Asia/Ulaanbaatar">Ulaanbaatar</option>
                        <option value="Asia/Almaty">Almaty</option>
                        <option value="Asia/Tashkent">Tashkent</option>
                        <option value="Asia/Yekaterinburg">
                          Yekaterinburg
                        </option>
                        <option value="Asia/Novosibirsk">Novosibirsk</option>
                        <option value="Asia/Vladivostok">Vladivostok</option>
                      </optgroup>

                      <optgroup label="Australia & Pacific">
                        <option value="Australia/Sydney">Sydney</option>
                        <option value="Australia/Melbourne">Melbourne</option>
                        <option value="Australia/Brisbane">Brisbane</option>
                        <option value="Australia/Perth">Perth</option>
                        <option value="Australia/Adelaide">Adelaide</option>
                        <option value="Australia/Darwin">Darwin</option>
                        <option value="Australia/Hobart">Hobart</option>
                        <option value="Pacific/Auckland">Auckland</option>
                        <option value="Pacific/Fiji">Fiji</option>
                        <option value="Pacific/Guam">Guam</option>
                        <option value="Pacific/Port_Moresby">
                          Port Moresby
                        </option>
                        <option value="Pacific/Tahiti">Tahiti</option>
                        <option value="Pacific/Tongatapu">Tonga</option>
                      </optgroup>
                    </select>
                  </div>
                  <SaveCancelButtons
                    onSave={() => {}}
                    onCancel={() => setEditMode(false)}
                    isSaving={saving}
                    disabled={saving}
                    saveType="submit"
                  />
                </form>
              )}

              {profileUpdateStatus && (
                <div
                  className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
                    profileUpdateStatus.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}>
                  {profileUpdateStatus.message}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* English Level */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">English Level</h2>
              <form onSubmit={handleLevelUpdate}>
                <select
                  value={englishLevel}
                  onChange={(e) => setEnglishLevel(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg mb-4">
                  <option value="">-- Select Level --</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Pre-Intermediate">Pre-Intermediate</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Upper-Intermediate">Upper-Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                </select>
                <button type="submit" className="btn btn-outline-secondary">
                  Update Level
                </button>
              </form>
              {levelUpdateStatus && (
                <div
                  className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
                    levelUpdateStatus.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}>
                  {levelUpdateStatus.message}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-accent-blue-dark text-white rounded-lg shadow-md p-6 hover:bg-blue-700 transition">
                <h3 className="text-xl font-semibold mb-2">📅 Book a Lesson</h3>
                <p className="text-blue-50 mb-4">
                  View available time slots and schedule your next lesson
                </p>
                <InfoButton
                  href="/calendar"
                  text="View Calendar"
                  className="bg-white border-accent-blue-dark text-accent-blue-dark hover:bg-blue-50"
                />
              </div>

              <a
                href="https://www.paypal.com/cgi-bin/webscr?business=97DKP326AXSAA&cmd=_xclick&item_name=Monthly+Subscription&currency_code=USD&no_shipping=2&button_subtype=services&undefined_quantity=1&bn=97DKP326AXSAA%3APP-BuyNowBF_S&no_note=0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 text-white rounded-lg shadow-md p-6 hover:bg-yellow-600 transition">
                <h3 className="text-xl font-semibold mb-2">💳 Pay by PayPal</h3>
                <p className="text-yellow-100 mb-4">
                  Make a payment for your lessons securely
                </p>
              </a>

              <div className="bg-green-600 text-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">
                  🎓 Enter V-Classroom
                </h3>
                <p className="text-green-100 mb-4">10 min before your lesson</p>
                <InfoButton
                  href="/session"
                  text="Join"
                  className="bg-white border-green-600 text-green-600 hover:bg-green-50"
                />
              </div>
            </div>

            {/* Upcoming Lessons */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Upcoming Lessons</h2>

              {loadingLessons ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading your lessons...</div>
                </div>
              ) : upcomingLessons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You don't have any upcoming lessons scheduled.
                  </p>
                  <InfoButton href="/calendar" text="Book a Lesson" />
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => {
                    const isJoinable = joinableLessons.some(
                      (jl) => jl.id === lesson.id,
                    );
                    const startTime = new Date(lesson.startTime);
                    const isPast = startTime < now;

                    return (
                      <div
                        key={lesson.id}
                        className={`border rounded-lg p-4 hover:shadow-md transition ${
                          isJoinable
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {lesson.title}
                              </h3>
                              {isJoinable && (
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                  Ready to Join
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">
                              📅{" "}
                              {new Date(lesson.startTime).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-gray-600">
                              🕐{" "}
                              {new Date(lesson.startTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}{" "}
                              -{" "}
                              {new Date(lesson.endTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Status:{" "}
                              <span className="capitalize font-medium">
                                {lesson.status}
                              </span>
                            </p>
                            {lesson.notes && (
                              <p className="text-gray-500 text-sm mt-2">
                                📝 {lesson.notes}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 flex flex-col gap-2">
                            {isJoinable && (
                              <InfoButton
                                href="/session"
                                text="Join Lesson"
                                className="bg-green-600 text-white border-green-600 hover:bg-green-700"
                              />
                            )}
                            {!isPast && (
                              <button
                                onClick={() => handleCancelLesson(lesson.id)}
                                className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition text-sm">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
