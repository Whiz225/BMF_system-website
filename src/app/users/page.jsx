"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  User,
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Pencil,
  Trash,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser, updateUser, getAllUser } from "@/lib/actions";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "business_owner") {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUser();
      setUsers(response || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (userId === user?._id) {
      toast.error("You cannot deactivate your own account");
      return;
    }

    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      await deleteUser(userId);
      //   await axios.delete(`/api/users/${userId}`);
      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to deactivate user");
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const endpoint = isActive
        ? `/users/${userId}/activate`
        : `/users/${userId}`;

      const method = isActive ? "patch" : "delete";

      await updateUser(method, endpoint);
      toast.success(
        `User ${isActive ? "activated" : "deactivated"} successfully`
      );
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      search === "" ||
      userItem.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      userItem.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      userItem.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "" || userItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (!user || user.role !== "business_owner") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ShieldCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only business owners can access user management
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system users and permissions
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/users/new")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sales Staff
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.role === "salesperson").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="business_owner">Business Owner</option>
              <option value="sales_manager">Sales Manager</option>
              <option value="salesperson">Salesperson</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search
                ? "Try a different search"
                : "Add your first user to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {filteredUsers.map((userItem) => (
                  <div
                    key={userItem._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {userItem.firstName} {userItem.lastName}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              userItem.role === "business_owner"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : userItem.role === "sales_manager"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {userItem.role?.replace("_", " ")}
                          </span>
                          <span
                            className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              userItem.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {userItem.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {userItem.email}
                        </span>
                      </div>

                      {userItem.lastLogin && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last login:{" "}
                          {format(new Date(userItem.lastLogin), "MMM dd, yyyy")}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <button
                        onClick={() =>
                          (window.location.href = `/users/${userItem._id}`)
                        }
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Manage
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleToggleActive(userItem._id, !userItem.isActive)
                          }
                          className={`${
                            userItem.isActive
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {userItem.isActive ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        {userItem._id !== user._id && (
                          <button
                            onClick={() => handleDelete(userItem._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((userItem) => (
                    <tr
                      key={userItem._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userItem.firstName} {userItem.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Joined{" "}
                              {format(new Date(userItem.createdAt), "MMM yyyy")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userItem.role === "business_owner"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : userItem.role === "sales_manager"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {userItem.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {userItem.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {userItem.lastLogin
                            ? format(
                                new Date(userItem.lastLogin),
                                "MMM dd, yyyy"
                              )
                            : "Never"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userItem.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {userItem.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              (window.location.href = `/users/${userItem._id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleActive(
                                userItem._id,
                                !userItem.isActive
                              )
                            }
                            className={`${
                              userItem.isActive
                                ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            }`}
                            disabled={userItem._id === user._id}
                          >
                            {userItem.isActive ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                          {userItem._id !== user._id && (
                            <button
                              onClick={() => handleDelete(userItem._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
