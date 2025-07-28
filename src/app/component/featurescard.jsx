// Define a reusable FeatureCard component
import {IconWrapper} from "@/app/component/iconwrapper"
export const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <IconWrapper>{icon}</IconWrapper>
    <h4 className="feature-card-title">{title}</h4>
    <p className="feature-card-description">{description}</p>
  </div>
);