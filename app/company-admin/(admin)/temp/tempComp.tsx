// components/tables/AssetTable.tsx
"use client";
import React, { useEffect, useState } from "react";
import IconButton from "@/components/common-components/buttons/IconButton";
import IconTextButton from "@/components/common-components/buttons/IconTextButton";
 
import { useSearchParams } from "next/navigation";
import Toast from "@/components/common-components/Toast";
import { GetAssetList, DeleteAsset } from "@/services/company-admin/asset";
import { getSessionId } from "@/utils/cookies";
import Cookies from "js-cookie";
import Pagination from "@/components/common-components/Pagination";
import Skeleton from "@/components/common-components/Skeleton";
import DeleteConfirmPopup from "@/components/common-components/DeleteConfirmPopup";
 
type Asset = {
  id: number;
  tag: {
    id: number;
    uid: string;
    tag_type: string;
  } | null;
  name: string;
  location: {
    id: number;
    location_name: string;
  };
  batch_code: string;
  status: number;
};
 
const AssetTable: React.FC = () => {
  const [assetlist, setAssetlist] = useState<Asset[]>([]);
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string[]>([]);
  const [is_super_admin, setIsSuperAdmin] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
 
 
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      window.history.replaceState(
        {},
        document.title,
        "/company-admin/asset"  
      );
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
 
    else if (searchParams.get("success") === "deletetrue") {
      setShowDeleteSuccess(true);
      window.history.replaceState(
        {},
        document.title,
        "/company-admin/asset"
      );
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 5000);
    }
  }, [searchParams]);
 
  useEffect(() => {
    async function fetchrole() {
      const userdata = await getSessionId("company_user_session");
      const role = userdata?.user?.role?.permission["asset"];
      const is_super_admin = userdata?.is_super_user;
      await setUserRole(role || []);
      if (is_super_admin == true) {
        setIsSuperAdmin(true);
      }
    }
 
    const fetchAssets = async () => {
      setLoading(true);
      const userdata = await getSessionId("company_user_session");
      const role = userdata?.user?.role?.permission["asset"];
      setUserRole(role || []);
 
      const cookieFilters = Cookies.get("asset_filters");
      let parsedFilters = null;
      if (cookieFilters) {
        try {
          parsedFilters = JSON.parse(cookieFilters);
          // setPage(page);
        } catch (err) {
          console.warn("Invalid cookie:", err);
        }
      }
      const response = await GetAssetList(page, pageSize, parsedFilters);
 
      if (response.has_error && response.message === "Permission denied") {
        setError({ permission: "Permission Denied" });
        setLoading(false);
        return;
      }
 
      if (response.has_error && response.message === "Asset not found") {
        setLoading(false);
        setAssetlist([]);
        setTotal(0);
        return;
      }
      if (
        !response.has_error &&
        response.message === "Assets fetched successfully"
      ) {
        setAssetlist(response.assets);
        setError({});
        setTotal(response.total);
        setLoading(false);
        return;
      }
      if (
        response.has_error &&
        response.message === "Invalid or expired session"
      ) {
        setLoading(false);
        alert("Session is over, Please Login Again.");
        Cookies.remove("company_user_session");
        window.location.reload();
        return;
      }
      if (response.has_error) {
        setLoading(false);
        setError({ api: response.message });
        setAssetlist([]);
        setTotal(0);
        return;
      }
      setLoading(false);
    };
    fetchAssets();
    fetchrole();
    // Event listener for filter changes
    const handleFiltersChanged = () => fetchAssets();
    window.addEventListener("filtersChanged", handleFiltersChanged);
 
    return () => {
      window.removeEventListener("filtersChanged", handleFiltersChanged);
    };
  }, [page, pageSize, is_super_admin]);
 
  const handleDelete = async (id: string) => {
    setSelectedAssetId(id);
    setShowPopup(true);
  };
 
  const handleConfirmDelete = async () => {
    if (!selectedAssetId) return;
    const response = await DeleteAsset(parseInt(selectedAssetId));
    if (response.has_error && response.message == "Permission denied") {
      setError({ permission: "Permission Denied" });
      setLoading(false);
      setShowPopup(false);
      return;
    }
 
    if (response.has_error) {
      setError({ deleteapi: response.message });
      setShowPopup(false);
      setSelectedAssetId(null);
      return;
    }
    if (!response.has_error) {
      setShowPopup(false);
      setSelectedAssetId(null);
      setShowDeleteSuccess(true);
      const cookieFilters = Cookies.get("asset_filters");
      let parsedFilters = null;
      if (cookieFilters) {
        try {
          parsedFilters = JSON.parse(cookieFilters);
          setPage(1);
        } catch (err) {
          console.warn("Invalid cookie:", err);
        }
      }
      // Fetch updated user list after successful deletion
 
      const response = await GetAssetList(page, pageSize, parsedFilters);
 
      if (response.has_error && response.message == "Permission denied") {
        setError({ permission: "Permission Denied" });
        setLoading(false);
        setShowPopup(false);
        return;
      }
 
      if (response.has_error && response.message === "Asset not found") {
        setLoading(false);
        setAssetlist([]);
        setTotal(0);
        return;
      }
      if (
        !response.has_error &&
        response.message === "Assets fetched successfully"
      ) {
        setAssetlist(response.assets);
        setError({});
        setTotal(response.total);
        setLoading(false);
        return;
      }
      if (
        response.has_error &&
        response.message === "Invalid or expired session"
      ) {
        setLoading(false);
        alert("Session is over, Please Login Again.");
        Cookies.remove("company_user_session");
        window.location.reload();
        return;
      }
      if (response.has_error) {
        setLoading(false);
        setError({ api: response.message });
        setAssetlist([]);
        setTotal(0);
        return;
      }
    }
  };
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="card-box">
      <div className="card-box_head">
        <h3 className="title h3">Asset List</h3>
        <div className="actions-btn">
          {(is_super_admin || userRole.includes("create")) && (
            <IconTextButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z"
                    fill="#845ADF"
                  />
                </svg>
              }
              href="/company-admin/asset/add"
              variant="primary"
              label="Add asset"
            />
          )}
        </div>
      </div>
      <div className="card-box_body">
        {showSuccess && (
          <Toast text="Asset Created successfully" type="success" />
        )}
        {showDeleteSuccess && (
          <Toast text="Asset Deleted Successfully" type="success" />
        )}
        {error.permission && <Toast text={error.permission} type="error" />}
 
        {loading ? (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Id</th>
                <th style={{ width: "calc(26% - 50px)" }}>UID</th>
                <th style={{ width: "18%" }}>Asset Name</th>
                <th style={{ width: "14%" }}>Tag Type</th>
                <th style={{ width: "14%" }}>Batch Code</th>
                <th style={{ width: "14%" }}>Status</th>
                <th style={{ width: "14%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="" colSpan={7}>
                  <Skeleton width="100%" height="28px" />
                </td>
              </tr>
              <tr>
                <td className="" colSpan={7}>
                  <Skeleton width="100%" height="28px" />
                </td>
              </tr>
              <tr>
                <td className="" colSpan={7}>
                  <Skeleton width="100%" height="28px" />
                </td>
              </tr>
            </tbody>
          </table>
        ) : error.api ? (
          <Toast text={error.api} type="error" />
        ) : is_super_admin || userRole.includes("list") ? (
          <div className="table-wrapper">
            {assetlist.length !== 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>Id</th>
                      <th style={{ width: "calc(26% - 50px)" }}>UID</th>
                      <th style={{ width: "18%" }}>Asset Name</th>
                      <th style={{ width: "14%" }}>Tag Type</th>
                      <th style={{ width: "14%" }}>Batch Code</th>
                      <th style={{ width: "14%" }}>Status</th>
                      {(is_super_admin ||
                        userRole.includes("delete") ||
                        userRole.includes("update")) && (
                          <th style={{ width: "14%" }}>Action</th>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {assetlist.map((asset, index) => (
                      <tr key={index}>
                        <td>{asset.id}</td>
                        <td>{asset?.tag?.uid || "N/A"}</td>
                        <td>{asset.name}</td>
                        <td>{asset?.tag?.tag_type || "N/A"}</td>
                        <td>{asset.batch_code}</td>
                        <td>
                          <span
                            className={`status ${asset.status == 0 ? "active" : asset.status == 1 ? "processing" : "expired"
                              }`}
                          >
                            {asset.status == 0 ? "GOOD" : asset.status == 1 ? "WARNING" : "DAMAGED"}
                          </span>
                        </td>
                        {(is_super_admin ||
                          userRole.includes("delete") ||
                          userRole.includes("update")) && (
                            <td>
                              <div className="actions-btn">
                                <div className="actions-btn">
                                  {(is_super_admin ||
                                    userRole.includes("update")) && (
                                      <IconButton
                                        icon={<EditIcon />}
                                        tooltip="Edit"
                                        variant="edit"
                                        href={`/company-admin/asset/edit/${asset.id}`}
                                      />
                                    )}
                                  {(is_super_admin ||
                                    userRole.includes("delete")) && (
                                      <IconButton
                                        icon={<DeleteIcon />}
                                        variant="delete"
                                        tooltip="Delete"
                                        onClick={() =>
                                          handleDelete(String(asset.id))
                                        }
                                      />
                                    )}
                                </div>
                              </div>
                            </td>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  totalRecords={total}
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            ) : (
              !error.permission && (
                <>
                  <span className="d-flex justify-content-center p-24">
                    No result found
                  </span>
                </>
              )
            )}
          </div>
        ) : (
          !error.permission && <Toast text="Permission Denined" type="error" />
        )}
      </div>
      {showPopup && (
        <DeleteConfirmPopup
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowPopup(false)}
          onClose={() => setShowPopup(false)}
          title={"Remove this Asset?"}
          message="Are you sure you want to remove this asset from your asset list? We'd hate to see it go!"
        />
      )}
    </div>
  );
};
 
 
export default AssetTable;