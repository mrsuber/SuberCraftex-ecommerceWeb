export default function TestCSS() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold text-primary">CSS Test Page</h1>

      <div className="space-y-4">
        <p className="text-lg">If you can see colors and styling, CSS is working:</p>

        <div className="flex gap-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-lg">
            Primary Color (#D4AF76)
          </div>
          <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
            Secondary Color (#9d8860)
          </div>
        </div>

        <div className="border-4 border-primary p-4 rounded-lg">
          <p className="text-2xl font-bold">This has a champagne gold border</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded">Grid 1</div>
          <div className="bg-green-500 text-white p-4 rounded">Grid 2</div>
          <div className="bg-red-500 text-white p-4 rounded">Grid 3</div>
        </div>
      </div>
    </div>
  );
}
