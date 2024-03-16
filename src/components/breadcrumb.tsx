// components/Breadcrumb.tsx
import Link from 'next/link';

interface BreadcrumbItem {
  text: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
       <ol className="breadcrumb">
        {items.map((item, index) => (
          <span key={index} className="breadcrumb-item ">
            {index !== items.length - 1 ? (
              <Link className='_link' href={item.href}>
                <span>{item.text}</span>
              </Link>
            ) : (
              <span>{item.text}</span>
            )}
          </span>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
