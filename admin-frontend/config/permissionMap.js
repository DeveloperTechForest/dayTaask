// /config/permissionMap.js

export const PERMISSION_MAP = {
  Dashboard: {
    read: "dashboard.view",
    stats: "dashboard.stats",
    analytics: "dashboard.analytics",
  },

  Users: {
    read: "user.view",
    create: "user.create",
    update: "user.update",
    delete: "user.delete",
    verify_email: "user.verify.email",
    verify_phone: "user.verify.phone",
  },

  "User Addresses": {
    read: "user.address.view",
    create: "user.address.create",
    update: "user.address.update",
    delete: "user.address.delete",
  },

  Roles: {
    read: "role.view",
    create: "role.create",
    update: "role.update",
    delete: "role.delete",
    assign: "role.assign",
    revoke: "role.revoke",
  },

  Permissions: {
    read: "permission.view",
    assign: "permission.assign",
    revoke: "permission.revoke",
  },

  Categories: {
    read: "category.view",
    create: "category.create",
    update: "category.update",
    delete: "category.delete",
  },

  Services: {
    read: "service.view",
    create: "service.create",
    update: "service.update",
    delete: "service.delete",
  },

  Addons: {
    read: "addon.view",
    create: "addon.create",
    update: "addon.update",
    delete: "addon.delete",
  },

  Taaskrs: {
    read: "taaskr.view",
    create: "taaskr.create",
    update: "taaskr.update",
    delete: "taaskr.delete",
    verify: "taaskr.verify",
    set_availability: "taaskr.set_availability",
  },

  "Taaskr Profiles": {
    read: "taaskr.profile.view",
    update: "taaskr.profile.update",
  },

  "Taaskr Availability": {
    read: "taaskr.availability.view",
    create: "taaskr.availability.create",
    update: "taaskr.availability.update",
    delete: "taaskr.availability.delete",
  },

  Bookings: {
    read: "booking.view",
    create: "booking.create",
    update: "booking.update",
    cancel: "booking.cancel",
    assign: "booking.assign",
    complete: "booking.complete",
    refund: "booking.refund",
  },

  "Booking Addons": {
    read: "booking.addon.view",
    create: "booking.addon.create",
    update: "booking.addon.update",
    delete: "booking.addon.delete",
  },

  "Booking Recordings": {
    read: "booking.recording.view",
    create: "booking.recording.create",
    update: "booking.recording.update",
    delete: "booking.recording.delete",
  },

  "Booking Warranties": {
    read: "booking.warranty.view",
    create: "booking.warranty.create",
    update: "booking.warranty.update",
    delete: "booking.warranty.delete",
  },

  "Consultation Projects": {
    read: "consultation.project.view",
    create: "consultation.project.create",
    update: "consultation.project.update",
    delete: "consultation.project.delete",
  },

  Complaints: {
    read: "complaint.view",
    create: "complaint.create",
    update: "complaint.update",
    resolve: "complaint.resolve",
  },

  Notifications: {
    read: "notification.view",
    create: "notification.create",
    mark_read: "notification.mark_read",
    delete: "notification.delete",
  },

  Payments: {
    read: "payment.view",
    refund: "payment.refund",
  },

  Logs: {
    read: "logs.view",
    export: "logs.export",
  },
};
