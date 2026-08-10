param(
  [string]$BaseUrl = "http://localhost:8000"
)

$ObjectId = "000000000000000000000000"

$Tests = @(
  @{ Area = "Health"; Name = "Root health"; Method = "GET"; Path = "/"; Expected = @(200) },

  @{ Area = "Public"; Name = "Courses list"; Method = "GET"; Path = "/api/v1/get-courses"; Expected = @(200) },
  @{ Area = "Public"; Name = "Course details missing id"; Method = "GET"; Path = "/api/v1/get-course/$ObjectId"; Expected = @(200, 404) },
  @{ Area = "Public"; Name = "Blogs list"; Method = "GET"; Path = "/api/v1/all-blogs"; Expected = @(200) },
  @{ Area = "Public"; Name = "Blog details missing id"; Method = "GET"; Path = "/api/v1/blog-details/$ObjectId"; Expected = @(200, 404) },
  @{ Area = "Public"; Name = "Ebooks list"; Method = "GET"; Path = "/api/v1/all-ebooks"; Expected = @(200) },
  @{ Area = "Public"; Name = "Ebook details missing id"; Method = "GET"; Path = "/api/v1/ebook-details/$ObjectId"; Expected = @(404) },
  @{ Area = "Public"; Name = "Layout Banner"; Method = "GET"; Path = "/api/v1/get-layout/Banner"; Expected = @(200, 201) },
  @{ Area = "Public"; Name = "Layout FAQ"; Method = "GET"; Path = "/api/v1/get-layout/FAQ"; Expected = @(200, 201) },
  @{ Area = "Public"; Name = "Layout Categories"; Method = "GET"; Path = "/api/v1/get-layout/Categories"; Expected = @(200, 201) },
  @{ Area = "Public"; Name = "User course events"; Method = "GET"; Path = "/api/v1/UserGetCourseEvent"; Expected = @(200) },

  @{ Area = "Auth"; Name = "Login invalid body"; Method = "POST"; Path = "/api/v1/login"; Body = @{}; Expected = @(400) },
  @{ Area = "Auth"; Name = "Activate invalid body"; Method = "POST"; Path = "/api/v1/activate-user"; Body = @{}; Expected = @(400) },
  @{ Area = "Auth"; Name = "Social auth invalid body"; Method = "POST"; Path = "/api/v1/social-auth"; Body = @{}; Expected = @(400) },
  @{ Area = "Auth"; Name = "Me requires auth"; Method = "GET"; Path = "/api/v1/me"; Expected = @(400) },
  @{ Area = "Auth"; Name = "Logout requires auth"; Method = "GET"; Path = "/api/v1/logout"; Expected = @(400) },
  @{ Area = "Auth"; Name = "Update profile requires auth"; Method = "PUT"; Path = "/api/v1/update-user-info"; Body = @{}; Expected = @(400) },
  @{ Area = "Auth"; Name = "Update password requires auth"; Method = "PUT"; Path = "/api/v1/update-user-password"; Body = @{}; Expected = @(400) },
  @{ Area = "Auth"; Name = "Update avatar requires auth"; Method = "PUT"; Path = "/api/v1/update-user-avatar"; Body = @{}; Expected = @(400) },

  @{ Area = "Admin"; Name = "Get users"; Method = "GET"; Path = "/api/v1/get-users"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Update user role"; Method = "PUT"; Path = "/api/v1/update-user"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Delete user"; Method = "DELETE"; Path = "/api/v1/delete-user/$ObjectId"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Create course"; Method = "POST"; Path = "/api/v1/create-course"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Edit course"; Method = "PUT"; Path = "/api/v1/edit-course/$ObjectId"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Admin courses"; Method = "GET"; Path = "/api/v1/get-admin-courses"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Delete course"; Method = "DELETE"; Path = "/api/v1/delete-course/$ObjectId"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Orders"; Method = "GET"; Path = "/api/v1/get-orders"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Book orders"; Method = "GET"; Path = "/api/v1/get-Book-orders"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Notifications"; Method = "GET"; Path = "/api/v1/get-all-notifications"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Update notification"; Method = "PUT"; Path = "/api/v1/update-notification/$ObjectId"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Users analytics"; Method = "GET"; Path = "/api/v1/get-users-analytics"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Orders analytics"; Method = "GET"; Path = "/api/v1/get-orders-analytics"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Courses analytics"; Method = "GET"; Path = "/api/v1/get-courses-analytics"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Create layout"; Method = "POST"; Path = "/api/v1/create-layout"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Edit layout"; Method = "PUT"; Path = "/api/v1/edit-layout"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Create blog"; Method = "POST"; Path = "/api/v1/create-blog"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Delete blog"; Method = "DELETE"; Path = "/api/v1/delete-blog/$ObjectId"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Admin blogs"; Method = "GET"; Path = "/api/v1/all-admin-blogs"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Create ebook"; Method = "POST"; Path = "/api/v1/create-ebook"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Edit ebook"; Method = "PUT"; Path = "/api/v1/edit-ebook/$ObjectId"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Delete Ebook"; Method = "DELETE"; Path = "/api/v1/delete-Ebook/$ObjectId"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Admin ebooks"; Method = "GET"; Path = "/api/v1/get-allEbooks"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Create course event"; Method = "POST"; Path = "/api/v1/create-course-event"; Body = @{}; Expected = @(400) },
  @{ Area = "Admin"; Name = "Admin course events"; Method = "GET"; Path = "/api/v1/adminGetCourseEvent"; Expected = @(400) },
  @{ Area = "Admin"; Name = "Delete course event"; Method = "DELETE"; Path = "/api/v1/deleteCourseEvent/$ObjectId"; Expected = @(400) },

  @{ Area = "Course"; Name = "Course content requires auth"; Method = "GET"; Path = "/api/v1/get-course-content/$ObjectId"; Expected = @(400) },
  @{ Area = "Course"; Name = "Add question requires auth"; Method = "PUT"; Path = "/api/v1/add-question"; Body = @{}; Expected = @(400) },
  @{ Area = "Course"; Name = "Add answer requires auth"; Method = "PUT"; Path = "/api/v1/add-answer"; Body = @{}; Expected = @(400) },
  @{ Area = "Course"; Name = "Add review requires auth"; Method = "PUT"; Path = "/api/v1/add-review/$ObjectId"; Body = @{}; Expected = @(400) },
  @{ Area = "Course"; Name = "Add reply requires admin"; Method = "PUT"; Path = "/api/v1/add-reply"; Body = @{}; Expected = @(400) },

  @{ Area = "Payment"; Name = "Create order invalid body"; Method = "POST"; Path = "/api/v1/create-order"; Body = @{}; Expected = @(400, 404, 500) },
  @{ Area = "Payment"; Name = "Create book order invalid body"; Method = "POST"; Path = "/api/v1/create-BookOrder"; Body = @{}; Expected = @(400, 404, 500) },
  @{ Area = "Payment"; Name = "Validate order invalid signature"; Method = "POST"; Path = "/api/v1/validate-order"; Body = @{ razorpay_order_id = "order_test"; razorpay_payment_id = "pay_test"; razorpay_signature = "bad" }; Expected = @(400) },
  @{ Area = "Payment"; Name = "Validate book order invalid signature"; Method = "POST"; Path = "/api/v1/validateBookOrder"; Body = @{ razorpay_order_id = "order_test"; razorpay_payment_id = "pay_test"; razorpay_signature = "bad" }; Expected = @(400) },

  @{ Area = "Mismatch"; Name = "Contact create-message client route"; Method = "POST"; Path = "/api/v1/create-message"; Body = @{}; Expected = @(404) },
  @{ Area = "Mismatch"; Name = "Razorpay key client route"; Method = "GET"; Path = "/api/v1/payment/razorpaykey"; Expected = @(404) },
  @{ Area = "Mismatch"; Name = "Client all-admin-ebooks route"; Method = "GET"; Path = "/api/v1/all-admin-ebooks"; Expected = @(404) },
  @{ Area = "Mismatch"; Name = "Client delete-ebook lowercase route"; Method = "DELETE"; Path = "/api/v1/delete-ebook/$ObjectId"; Expected = @(400) },
  @{ Area = "Mismatch"; Name = "Client updateCourseEvent route"; Method = "PUT"; Path = "/api/v1/updateCourseEvent/$ObjectId"; Body = @{}; Expected = @(404) },

  @{ Area = "External"; Name = "VdoCipher OTP"; Method = "POST"; Path = "/api/v1/getVdoCipherOTP"; Skip = "Skipped to avoid calling paid/external VdoCipher API without a real video id." }
)

function Read-ErrorBody($Response) {
  if ($null -eq $Response) {
    return ""
  }

  try {
    $stream = $Response.GetResponseStream()
    if ($null -eq $stream) {
      return ""
    }
    $reader = New-Object System.IO.StreamReader($stream)
    return ($reader.ReadToEnd() -replace "`r?`n", " ")
  } catch {
    return ""
  }
}

$Results = foreach ($Test in $Tests) {
  if ($Test.Skip) {
    [pscustomobject]@{
      Area = $Test.Area
      Name = $Test.Name
      Method = $Test.Method
      Path = $Test.Path
      Status = "SKIP"
      Result = "SKIP"
      Expected = $Test.Skip
      Ms = 0
      Body = ""
    }
    continue
  }

  $Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
  $Status = $null
  $BodyText = ""

  try {
    $Params = @{
      Uri = "$BaseUrl$($Test.Path)"
      Method = $Test.Method
      TimeoutSec = 20
      UseBasicParsing = $true
      Headers = @{ Origin = "http://localhost:3000" }
    }

    if ($Test.ContainsKey("Body")) {
      $Params.Body = ($Test.Body | ConvertTo-Json -Depth 10)
      $Params.ContentType = "application/json"
    }

    $Response = Invoke-WebRequest @Params
    $Status = [int]$Response.StatusCode
    $BodyText = $Response.Content
  } catch {
    if ($_.Exception.Response) {
      $Status = [int]$_.Exception.Response.StatusCode
      $BodyText = Read-ErrorBody $_.Exception.Response
    } else {
      $BodyText = $_.Exception.Message
    }
  } finally {
    $Stopwatch.Stop()
  }

  $Result = if ($Test.Expected -contains $Status) { "PASS" } else { "FAIL" }
  if ($BodyText.Length -gt 160) {
    $BodyText = $BodyText.Substring(0, 160)
  }

  [pscustomobject]@{
    Area = $Test.Area
    Name = $Test.Name
    Method = $Test.Method
    Path = $Test.Path
    Status = $Status
    Result = $Result
    Expected = ($Test.Expected -join "/")
    Ms = $Stopwatch.ElapsedMilliseconds
    Body = ($BodyText -replace "\|", "/")
  }
}

$Results
