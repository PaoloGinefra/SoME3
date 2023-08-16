interface RoleProps {
    children: React.ReactNode;
    restProps?: any;
}

interface RoleListProps {
    roles: string[];
    restProps?: any;
}


export function Role({ children, ...restProps }: RoleProps) {
    return (
        <div className="bg-slate-700 font-bold italic rounded-md p-1">
            {children}
        </div>
    )
}

export default function RoleList({ roles, ...restProps }: RoleListProps) {
    return (
        <div className="flex flex-row flex-wrap gap-2 my-0">
            {roles.map((role, index) => (
                <Role key={index}>
                    {role}
                </Role>
            ))}
        </div>
    )
}