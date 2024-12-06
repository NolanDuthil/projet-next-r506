export function IntervenantsTableSkeleton() {
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              <IntervenantsMobileSkeleton />
              <IntervenantsMobileSkeleton />
              <IntervenantsMobileSkeleton />
              <IntervenantsMobileSkeleton />
              <IntervenantsMobileSkeleton />
              <IntervenantsMobileSkeleton />
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Firstname
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Lastname
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Key
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Creation Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    End Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  function IntervenantsMobileSkeleton() {
    return (
      <div className="mb-2 w-full rounded-md bg-white p-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between pt-4">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 w-20 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 w-20 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  function TableRowSkeleton() {
    return (
      <tr className="w-full border-b py-3 text-sm last-of-type:border-none">
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>
      </tr>
    );
  }