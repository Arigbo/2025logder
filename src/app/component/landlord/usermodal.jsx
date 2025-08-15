import Modal from "@/app/component/landlord/modal"; // Import your generic Modal component
import { DashboardContext } from "@/app/landlords/layout";
import { useContext } from "react";
export default function UserModal({ isUserModal, setIsUserModal }) {
  const { user } = useContext(DashboardContext);
  return (
    <>
      <Modal
        isOpen={isUserModal}
        onClose={() => {
          setIsUserModal(false);
        }}
        title={"Landlord"}
      >
        <div className="usermodal">
          {isUserModal ? user.name : ""}
        </div>
      </Modal>
    </>
  );
}
